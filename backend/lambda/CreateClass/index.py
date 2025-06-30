import json
import boto3
from boto3.dynamodb.conditions import Key
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        data = json.loads(event['body'])

        class_id = data.get('class_id') or str(uuid.uuid4())
        item = {
            'class_id': class_id,
            'name': data['name'],
            'instructor': data.get('instructor', 'No definido'),
            'max_capacity': int(data.get('max_capacity', 10)),
            'current_capacity': int(data.get('current_capacity', 0)),
            'icon': data.get('icon', '🧘')
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": "Clase creada exitosamente", "class_id": class_id})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }