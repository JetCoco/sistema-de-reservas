import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
reservations_table = dynamodb.Table('Reservations')
classes_table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        # Extraer claims del usuario autenticado
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')
        user_id = claims.get('sub')

        if not client_id or not user_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Faltan client_id o user_id en los claims'})
            }

        # Obtener datos del cuerpo de la solicitud
        body = json.loads(event['body'])
        class_id = body.get('class_id')

        if not class_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Falta class_id en la solicitud'})
            }

        # Verificar capacidad de la clase
        response = classes_table.get_item(Key={'class_id': class_id, 'client_id': client_id})
        item = response.get('Item')

        if not item:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Clase no encontrada'})
            }

        if item['current_capacity'] >= item['max_capacity']:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'La clase ya está llena'})
            }

        # Crear reserva
        reservation_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        reservations_table.put_item(Item={
            'reservation_id': reservation_id,
            'client_id': client_id,
            'user_id': user_id,
            'class_id': class_id,
            'timestamp': timestamp
        })

        # Actualizar capacidad de la clase
        classes_table.update_item(
            Key={'class_id': class_id, 'client_id': client_id},
            UpdateExpression='SET current_capacity = current_capacity + :inc',
            ExpressionAttributeValues={':inc': 1}
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Reserva realizada con éxito'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }