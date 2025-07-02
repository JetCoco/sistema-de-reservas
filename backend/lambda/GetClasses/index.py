import json
import boto3
import decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

# Convertidor para Decimals
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    try:
        # Obtener client_id del token Cognito
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')
        if not client_id:
            return error_response("Falta el client_id en el token JWT")

        # Escanear la tabla y filtrar por client_id (puede optimizarse con una GSI si es necesario)
        response = table.scan()
        items = response.get('Items', [])

        filtered = [item for item in items if item.get('client_id') == client_id]

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(filtered, cls=DecimalEncoder)
        }

    except Exception as e:
        return error_response(str(e))

def error_response(message):
    return {
        "statusCode": 500,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"error": message})
    }