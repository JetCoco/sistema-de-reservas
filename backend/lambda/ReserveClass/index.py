import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
classes_table = dynamodb.Table('Classes')
reservations_table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        class_id = body['class_id']
        user_id = body['user_id']
        client_id = body['client_id']

        class_item = classes_table.get_item(
            Key={'class_id': class_id, 'client_id': client_id}
        ).get('Item')

        if not class_item:
            return response(404, "Clase no encontrada")

        if class_item['current_capacity'] >= class_item['max_capacity']:
            return response(400, "Clase llena")

        reservations_table.put_item(
            Item={
                'reservation_id': f"{user_id}-{class_id}",
                'user_id': user_id,
                'class_id': class_id,
                'client_id': client_id,
                'timestamp': context.aws_request_id
            }
        )

        classes_table.update_item(
            Key={'class_id': class_id, 'client_id': client_id},
            UpdateExpression='SET current_capacity = current_capacity + :inc',
            ExpressionAttributeValues={':inc': 1}
        )

        return response(200, "Reserva exitosa")

    except ClientError as e:
        return response(500, f"Error AWS: {str(e)}")
    except Exception as e:
        return response(500, f"Error general: {str(e)}")

def response(code, message):
    return {
        'statusCode': code,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'message': message})
    }