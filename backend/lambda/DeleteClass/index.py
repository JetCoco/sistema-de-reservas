import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        data = json.loads(event['body'])
        class_id = data['class_id']

        table.delete_item(Key={'class_id': class_id})

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": "Clase eliminada correctamente"})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }