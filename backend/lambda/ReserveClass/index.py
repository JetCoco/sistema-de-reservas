import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
classes_table = dynamodb.Table('Classes')
reservations_table = dynamodb.Table('Reservations')

def lambda_handler(event, context):
    try:
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')
        user_id = claims.get('sub')  # ID único del usuario
        if not client_id or not user_id:
            return error_response("Faltan claims necesarios en el token")

        body = json.loads(event['body'])
        class_id = body['class_id']

        # Validar clase
        class_item = classes_table.get_item(Key={'class_id': class_id}).get('Item')
        if not class_item:
            return error_response("Clase no encontrada")

        if class_item['client_id'] != client_id:
            return error_response("No tienes permiso para reservar en esta clase")

        if class_item['current_capacity'] >= class_item['max_capacity']:
            return error_response("Clase llena")

        # Insertar reserva
        reservations_table.put_item(
            Item={
                'class_id': class_id,
                'user_id': user_id,
                'client_id': client_id,
                'timestamp': context.aws_request_id
            }
        )

        # Incrementar capacidad
        classes_table.update_item(
            Key={'class_id': class_id},
            UpdateExpression='SET current_capacity = current_capacity + :inc',
            ExpressionAttributeValues={':inc': 1}
        )

        return success_response("Reserva exitosa")

    except ClientError as e:
        return error_response(f"Error AWS: {str(e)}")
    except Exception as e:
        return error_response(f"Error general: {str(e)}")

def success_response(message):
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'message': message})
    }

def error_response(message):
    return {
        'statusCode': 500,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'error': message})
    }