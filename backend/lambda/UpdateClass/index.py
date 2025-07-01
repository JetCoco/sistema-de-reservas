import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        data = json.loads(event['body'])
        class_id = data['class_id']
        client_id = data['client_id']

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
            "Key": {
                'class_id': class_id,
                'client_id': client_id
            },
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
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }