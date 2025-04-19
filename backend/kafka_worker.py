
import os
import json
import time
from confluent_kafka import Consumer, Producer, KafkaError
from typing import Dict, Any
from .pipelines import (
    parse_job_description, 
    parse_resume, 
    upsert_job_embedding, 
    upsert_applicant_embedding
)

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")

# Producer configuration
producer_conf = {
    'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
    'client.id': 'recruitment-producer'
}

# Consumer configuration
consumer_conf = {
    'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
    'group.id': 'recruitment-consumers',
    'auto.offset.reset': 'earliest'
}

# Initialize producer
producer = Producer(producer_conf)

def delivery_report(err, msg):
    """Callback for message delivery reports."""
    if err is not None:
        print(f'Message delivery failed: {err}')
    else:
        print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def produce_message(topic: str, data: Dict[str, Any]):
    """Produce a message to Kafka topic."""
    try:
        producer.produce(
            topic, 
            json.dumps(data).encode('utf-8'), 
            callback=delivery_report
        )
        # Trigger any available delivery report callbacks
        producer.poll(0)
    except Exception as e:
        print(f"Failed to produce message: {str(e)}")
    
    # Wait for any outstanding messages to be delivered
    producer.flush()

def start_worker():
    """Start Kafka worker to process messages."""
    consumer = Consumer(consumer_conf)
    consumer.subscribe(['parse-job', 'parse-resume', 'generate-embedding'])
    
    try:
        while True:
            msg = consumer.poll(1.0)
            
            if msg is None:
                continue
                
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition event - not an error
                    continue
                else:
                    print(f"Error: {msg.error()}")
                    break
                    
            # Process message
            try:
                data = json.loads(msg.value().decode('utf-8'))
                topic = msg.topic()
                
                if topic == 'parse-job':
                    # Parse job description
                    job_text = data.get('text', '')
                    job_data = parse_job_description(job_text)
                    
                    # Send to embedding generation
                    produce_message('generate-embedding', {
                        'type': 'job',
                        'data': job_data
                    })
                    
                elif topic == 'parse-resume':
                    # Parse resume
                    resume_path = data.get('path', '')
                    applicant_data = parse_resume(resume_path)
                    
                    # Send to embedding generation
                    produce_message('generate-embedding', {
                        'type': 'applicant',
                        'data': applicant_data
                    })
                    
                elif topic == 'generate-embedding':
                    # Generate embeddings
                    data_type = data.get('type', '')
                    item_data = data.get('data', {})
                    
                    if data_type == 'job':
                        upsert_job_embedding(item_data)
                    elif data_type == 'applicant':
                        upsert_applicant_embedding(item_data)
                
            except Exception as e:
                print(f"Error processing message: {str(e)}")
                
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()

if __name__ == "__main__":
    start_worker()
