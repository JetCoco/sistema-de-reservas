import json
import boto3
import decimal
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        params = event.get('queryStringParameters') or {}
        client_id = params.get('client_id')
        instructor = params.get('instructor')

        if client_id and instructor:
            # Si ambos parámetros están presentes, usar filter
            response = table.scan(
                FilterExpression=Attr('client_id').eq(client_id) & Attr('instructor').eq(instructor)
            )
        else:
            # Si no hay filtros, trae todo
            response = table.scan()

        items = response.get('Items', [])

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(items, cls=DecimalEncoder)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }