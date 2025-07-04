import json
import boto3

dynamodb = boto3.resource('dynamodb')
classes_table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        # Extraer claims desde Cognito
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')

        if not client_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Falta el client_id del usuario autenticado'})
            }

        # Obtener class_id desde parámetros de la URL
        class_id = event['queryStringParameters'].get('class_id') if event.get('queryStringParameters') else None

        if not class_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Falta el parámetro class_id'})
            }

        # Eliminar la clase
        classes_table.delete_item(
            Key={
                'class_id': class_id,
                'client_id': client_id
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Clase eliminada exitosamente'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }