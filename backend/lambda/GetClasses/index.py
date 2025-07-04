import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        # Obtener claims del token JWT
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')
        user_id = claims.get('sub')
        role = claims.get('custom:role')

        if not client_id or not role:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Faltan atributos en el token'})
            }

        # Obtener parámetros desde la query string (si existen)
        params = event.get('queryStringParameters') or {}
        instructor_id = params.get('instructor_id') if role == 'instructor' else None

        # Construir condición de consulta
        key_condition = Key('client_id').eq(client_id)
        if instructor_id:
            key_condition &= Key('instructor_id').eq(instructor_id)

        # Realizar la consulta
        response = table.query(
            IndexName='client_id-index',  # Asegúrate de tener este índice secundario
            KeyConditionExpression=key_condition
        )

        return {
            'statusCode': 200,
            'body': json.dumps(response['Items'])
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }