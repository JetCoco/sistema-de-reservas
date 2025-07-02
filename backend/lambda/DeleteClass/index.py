import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')
        if not client_id:
            return error_response("Falta el client_id en el token")

        data = json.loads(event['body'])
        class_id = data['class_id']

        existing = table.get_item(Key={'class_id': class_id}).get('Item')
        if not existing:
            return error_response("Clase no encontrada")
        if existing.get('client_id') != client_id:
            return error_response("No tienes permiso para eliminar esta clase")

        response = table.delete_item(Key={'class_id': class_id})

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Clase eliminada correctamente",
                "response": response
            })
        }

    except Exception as e:
        return error_response(str(e))

def error_response(msg):
    return {
        "statusCode": 500,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"error": msg})
    }