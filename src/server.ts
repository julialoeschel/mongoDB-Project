import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDatabase, getUserCollection } from './utils/database';

if (!process.env.KEY_URL_MONGOBD)
  throw new Error('no KEY_URL_MONGOBD provided');

const app = express();
const port = 3000;

app.use(express.json());
//View DB
app.get('/Kurse', async (_request, response) => {
  const CoursList = await getUserCollection().find().toArray();
  response.send(CoursList);
});

//post Course
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

//update Content
app.patch('/Kurse/update', async (request, response) => {
  const newContentText = request.body.newContent;
  const oldContentText = request.body.oldContent;
  const newValues = { $set: { content: newContentText } };
  const isExisting = await getUserCollection().findOne({
    content: oldContentText,
  });
  console.log(isExisting);

  if (isExisting) {
    await getUserCollection().updateOne({ content: oldContentText }, newValues);
    response.send(`context set to ${newContentText}`);
  } else {
    response.send('content not existing');
  }
});

//Post Teilnehmner
app.post('/Kurse/001', async (request, response) => {
  const newParticipant = request.body;
  const doesParticipantExist = await getUserCollection().findOne({
    username: newParticipant.username,
  });
  console.log(doesParticipantExist);

  if (doesParticipantExist) {
    response.send(
      `Participant with username ${newParticipant.username} already exists`
    );
  } else {
    await getUserCollection().insertOne(newParticipant);
    response.send(
      `new Participant with name ${newParticipant.name} added to Course!`
    );
  }
});

//Delete Course
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

//Delete Course
app.delete('/Kurse/:username', async (request, response) => {
  const usernameToBeDeleted = request.params.username;
  const doesCourseExist = await getUserCollection().findOne({
    username: usernameToBeDeleted,
  });
  if (doesCourseExist) {
    await getUserCollection().deleteOne({
      username: usernameToBeDeleted,
    });
    response.send(
      `DELETE SUCCESSFULL! username ${usernameToBeDeleted} deleted!`
    );
  } else
    response.send(
      `DELETE FAIL! username ${usernameToBeDeleted} does not exist!`
    );
});

connectDatabase(process.env.KEY_URL_MONGOBD).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
