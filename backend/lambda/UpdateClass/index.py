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

        # Obtener clase actual y validar client_id
        existing = table.get_item(Key={'class_id': class_id}).get('Item')
        if not existing:
            return error_response("Clase no encontrada")
        if existing.get('client_id') != client_id:
            return error_response("No tienes permiso para modificar esta clase")

        update_expression = "SET "
        expression_values = {}
        expression_names = {}

        for key in ['name', 'instructor', 'max_capacity', 'current_capacity', 'icon']:
            if key in data:
                attr_key = f"#{key}" if key == "name" else key
                update_expression += f"{attr_key} = :{key}, "
                expression_values[f":{key}"] = data[key]
                if key == "name":
                    expression_names["#name"] = "name"

        update_expression = update_expression.rstrip(", ")

        update_params = {
            "Key": {'class_id': class_id},
            "UpdateExpression": update_expression,
            "ExpressionAttributeValues": expression_values
        }

        if expression_names:
            update_params["ExpressionAttributeNames"] = expression_names

        table.update_item(**update_params)

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": "Clase actualizada correctamente"})
        }

    except Exception as e:
        return error_response(str(e))

def error_response(msg):
    return {
        "statusCode": 500,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"error": msg})
    }