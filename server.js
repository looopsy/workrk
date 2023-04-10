const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Подключение к базе данных
mongoose.connect('mongodb://localhost/courses', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Определение схемы данных
const courseSchema = new mongoose.Schema({
  name: String,
  phone: String,
  course: String,
  comment: String,
});

// Определение модели данных
const Course = mongoose.model('Course', courseSchema);

// Добавление middleware для парсинга тела запроса
app.use(bodyParser.json());

// Создание новой записи
app.post('/courses', async (req, res) => {
  const { name, phone, course, comment } = req.body;
  const newCourse = new Course({ name, phone, course, comment });
  await newCourse.save();
  res.send(newCourse);
});

// Получение всех записей
app.get('/courses', async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

// Обновление записи
app.put('/courses/:id', async (req, res) => {
  const { name, phone, course, comment } = req.body;
  const courseToUpdate = await Course.findById(req.params.id);
  if (!courseToUpdate) {
    return res.status(404).send({ message: 'Record not found' });
  }
  courseToUpdate.name = name || courseToUpdate.name;
  courseToUpdate.phone = phone || courseToUpdate.phone;
  courseToUpdate.course = course || courseToUpdate.course;
  courseToUpdate.comment = comment || courseToUpdate.comment;
  await courseToUpdate.save();
  res.send(courseToUpdate);
});

// Удаление записи
app.delete('/courses/:id', async (req, res) => {
  const courseToDelete = await Course.findByIdAndDelete(req.params.id);
  if (!courseToDelete) {
    return res.status(404).send({ message: 'Record not found' });
  }
  res.send(courseToDelete);
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
