import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDatabase, getUserCollection } from './utils/database';

if (!process.env.KEY_URL_MONGOBD)
  throw new Error('no KEY_URL_MONGOBD provided');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/Kurse', async (request, response) => {
  const newCourse = request.body;
  const doesCourseExist = await getUserCollection().findOne({
    classNumber: newCourse.classNumber,
  });
  if (doesCourseExist) {
    response.send(
      `Course with the number ${newCourse.classNumber} already exists`
    );
  } else {
    await getUserCollection().insertOne(newCourse);
    response.send(`Hello! new Course with name ${newCourse.cursname} added!`);
  }
});

app.delete('/Kurse/:classNumber', async (request, response) => {
  const classNumberToBeDeleted = request.params.classNumber;
  const doesCourseExist = await getUserCollection().findOne({
    classNumber: classNumberToBeDeleted,
  });
  if (doesCourseExist) {
    await getUserCollection().deleteOne({
      classNumber: classNumberToBeDeleted,
    });
    response.send(
      `DELETE SUCCESSFULL! Course with Number ${classNumberToBeDeleted} deleted!`
    );
  } else
    response.send(
      `DELETE FAIL! Course with Number ${classNumberToBeDeleted} does not exist!`
    );
});

connectDatabase(process.env.KEY_URL_MONGOBD).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
