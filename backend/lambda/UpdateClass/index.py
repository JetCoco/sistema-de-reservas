import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        data = json.loads(event['body'])
        class_id = data['class_id']

        update_expression = "SET "
        expression_values = {}
        for key in ['name', 'instructor', 'max_capacity', 'current_capacity', 'icon']:
            if key in data:
                update_expression += f"{key} = :{key}, "
                expression_values[f":{key}"] = data[key]

        update_expression = update_expression.rstrip(", ")

        table.update_item(
            Key={'class_id': class_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values
        )

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