

// ==========================
//  Puerto
// ==========================

process.env.PORT = process.env.PORT || 3000;



// ==========================
//  Entorno
// ==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==========================
//  Vencimiento del token
// ==========================

process.env.CADUCIDAD_TOKEN = '48h'; 

// ==========================
//  Semilla de Autenticacion
// ==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==========================
//  Base de Datos
// ==========================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ==========================
//  Google Client ID
// ==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1079195682221-pbcptc5etljtmfqhv6chhcaoal04t4vo.apps.googleusercontent.com';