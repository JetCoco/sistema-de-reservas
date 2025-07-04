import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
classes_table = dynamodb.Table('Classes')

def lambda_handler(event, context):
    try:
        # Obtener claims desde Cognito
        claims = event['requestContext']['authorizer']['claims']
        client_id = claims.get('custom:client_id')
        instructor_id = claims.get('sub')

        if not client_id or not instructor_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Faltan atributos del usuario autenticado'})
            }

        # Parsear datos desde el body
        data = json.loads(event['body'])
        class_id = data.get('class_id')

        if not class_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Se requiere class_id'})
            }

        update_expr = []
        expr_attr_values = {}
        expr_attr_names = {}

        for field in ['name', 'icon', 'max_capacity']:
            if field in data:
                update_expr.append(f"#{field} = :{field}")
                expr_attr_values[f":{field}"] = data[field]
                expr_attr_names[f"#{field}"] = field

        if not update_expr:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'No se proporcionaron campos para actualizar'})
            }

        classes_table.update_item(
            Key={
                'class_id': class_id,
                'client_id': client_id
            },
            UpdateExpression="SET " + ", ".join(update_expr),
            ExpressionAttributeNames=expr_attr_names,
            ExpressionAttributeValues=expr_attr_values
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Clase actualizada correctamente'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }