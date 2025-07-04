import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
classes_table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        # Obtener claims desde Cognito
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')
        instructor_id = claims.get('sub')  # user_id del instructor
        email = claims.get('email')

        if not client_id or not instructor_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Faltan atributos del usuario autenticado'})
            }

        # Obtener los datos del body
        data = json.loads(event['body'])

        class_id = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S')  # formato ISO
        name = data.get('name')
        max_capacity = data.get('max_capacity')
        icon = data.get('icon', '🧘')

        if not name or not max_capacity:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Faltan campos obligatorios'})
            }

        # Guardar la nueva clase
        classes_table.put_item(Item={
            'class_id': class_id,
            'client_id': client_id,
            'name': name,
            'instructor_id': instructor_id,
            'icon': icon,
            'datetime': class_id,
            'max_capacity': int(max_capacity),
            'current_capacity': 0
        })

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Clase creada correctamente'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }