import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from 'uuid';

import { document } from '../utils/dynamodbClient';

interface ICreateTodo {
  title: string;
  deadline: string;  
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  console.log(new Date(deadline))

  await document.put({
    TableName: 'todos',
    Item: {
      id: uuidV4(),
      user_id,
      title,
      done: false,
      deadline: new Date(deadline).toISOString()
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo has created!',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}