requiere('dotenv').config();
const express = requiere('express');
const mongoose = requiere('mongoose');
const session = requiere('express-session');

const app = express();
const PORT = process.env.PORT;

//CONECTAR BASE DE DATOS

