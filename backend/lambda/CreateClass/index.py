import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        # Leer datos del cuerpo
        data = json.loads(event['body'])

        # Obtener client_id desde el token JWT
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')  # atributo personalizado
        if not client_id:
            return error_response("Falta el client_id en el token JWT")

        class_id = data.get('class_id') or str(uuid.uuid4())

        item = {
            'class_id': class_id,
            'client_id': client_id,
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
        return error_response(str(e))

def error_response(message):
    return {
        "statusCode": 500,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"error": message})
    }