// server.js - Parte de las importaciones
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();

// IMPORTACIÓN CORREGIDA - Destructuring
const { sequelize, testConnection } = require('./config/database');
const FormData = require('./models/FormData');  // <-- ESTO ES UNA FUNCIÓN, NO DESTRUCTURING

// Verificar que sequelize se importó bien
console.log('🔍 Verificando sequelize:', sequelize ? '✅ OK' : '❌ UNDEFINED');

////////////////////////////////

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB límite
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no válido'));
        }
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Configuración de vistas
app.set('view engine', 'html');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Sincronizar base de datos
sequelize.sync({ alter: true }).then(() => {
    console.log('Base de datos sincronizada');
    testConnection();
});

// Ruta principal - mostrar formulario
app.get('/', (req, res) => {
    res.render('index', {
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

// Ruta de éxito
app.get('/success', (req, res) => {
    res.render('success');
});

// Ruta para procesar el formulario
app.post('/submit-form', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'fotos_local', maxCount: 10 },
    { name: 'foto_fundador', maxCount: 1 },
    { name: 'fotos_galeria', maxCount: 20 },
    { name: 'material_adicional', maxCount: 10 }
]), async (req, res) => {
    try {
        // Procesar botones de acción
        const botonesAccion = req.body.botones_accion ? 
            (Array.isArray(req.body.botones_accion) ? req.body.botones_accion : [req.body.botones_accion]) : 
            [];

        // Procesar objetivos
        const objetivos = req.body.objetivos ? 
            (Array.isArray(req.body.objetivos) ? req.body.objetivos : [req.body.objetivos]) : 
            [];

        // Guardar datos principales del formulario
        const formData = await FormData.create({
            negocio_nombre: req.body.nombre_negocio,
            negocio_eslogan: req.body.eslogan,
            negocio_giro: req.body.giro_negocio,
            negocio_experiencia: req.body.experiencia,
            negocio_descripcion: req.body.descripcion_negocio,
            
            color_principal: req.body.color_principal,
            color_secundario: req.body.color_secundario,
            color_fondo: req.body.color_fondo,
            tiene_logo: req.body.tiene_logo === 'si',
            necesita_logo: req.body.necesita_logo === 'si',
            
            inicio_tiene_foto: req.body.tiene_foto_fondo === 'si',
            inicio_tipo_imagen: req.body.tipo_imagen_fondo,
            inicio_descripcion_imagen: req.body.descripcion_imagen_fondo,
            inicio_botones: JSON.stringify(botonesAccion),
            inicio_otro_boton: req.body.otro_boton,
            
            sobre_historia: req.body.historia_negocio,
            sobre_mision: req.body.mision,
            sobre_valores: req.body.valores,
            sobre_mostrar_equipo: req.body.mostrar_equipo === 'si',
            
            contacto_telefono_fijo: req.body.telefono_fijo,
            contacto_telefono_celular: req.body.telefono_celular,
            contacto_whatsapp: req.body.whatsapp,
            contacto_email: req.body.email_contacto,
            contacto_direccion: req.body.direccion,
            contacto_como_llegar: req.body.como_llegar,
            contacto_horario: req.body.horario,
            
            redes_facebook_tiene: req.body.redes_facebook_tiene === 'si',
            redes_facebook_link: req.body.redes_facebook_link,
            redes_instagram_tiene: req.body.redes_instagram_tiene === 'si',
            redes_instagram_link: req.body.redes_instagram_link,
            redes_twitter_tiene: req.body.redes_twitter_tiene === 'si',
            redes_twitter_link: req.body.redes_twitter_link,
            redes_tiktok_tiene: req.body.redes_tiktok_tiene === 'si',
            redes_tiktok_link: req.body.redes_tiktok_link,
            redes_youtube_tiene: req.body.redes_youtube_tiene === 'si',
            redes_youtube_link: req.body.redes_youtube_link,
            redes_linkedin_tiene: req.body.redes_linkedin_tiene === 'si',
            redes_linkedin_link: req.body.redes_linkedin_link,
            
            maps_mostrar: req.body.mostrar_mapa === 'si',
            maps_direccion: req.body.direccion_mapa,
            maps_codigo: req.body.codigo_mapa,
            
            objetivos: JSON.stringify(objetivos),
            otro_objetivo: req.body.otro_objetivo,
            competencia: req.body.competencia,
            paginas_inspiracion: req.body.paginas_inspiracion,
            contenido_extra: req.body.contenido_extra,
            
            responsable_nombre: req.body.nombre_responsable,
            responsable_telefono: req.body.telefono_contacto,
            responsable_email: req.body.email_notificaciones,
            preferencia_contacto: req.body.preferencia_contacto,
            fecha_limite: req.body.fecha_limite
        });

        // Procesar logo
        if (req.files && req.files['logo']) {
            await formData.update({
                logo_filename: req.files['logo'][0].filename,
                logo_path: req.files['logo'][0].path
            });
        }

        // Procesar foto del fundador
        if (req.files && req.files['foto_fundador']) {
            await formData.update({
                sobre_foto_fundador_filename: req.files['foto_fundador'][0].filename
            });
        }

        // Procesar servicios
        if (req.body.servicios_nombre) {
            const nombres = Array.isArray(req.body.servicios_nombre) ? req.body.servicios_nombre : [req.body.servicios_nombre];
            const descripciones = Array.isArray(req.body.servicios_descripcion) ? req.body.servicios_descripcion : [req.body.servicios_descripcion];
            const iconos = Array.isArray(req.body.servicios_icono) ? req.body.servicios_icono : [req.body.servicios_icono];
            
            for (let i = 0; i < nombres.length; i++) {
                if (nombres[i]) {
                    await Servicio.create({
                        form_id: formData.id,
                        nombre: nombres[i],
                        descripcion: descripciones[i],
                        icono: iconos[i]
                    });
                }
            }
        }

        // Procesar testimonios
        if (req.body.testimonios_cliente) {
            const clientes = Array.isArray(req.body.testimonios_cliente) ? req.body.testimonios_cliente : [req.body.testimonios_cliente];
            const comentarios = Array.isArray(req.body.testimonios_comentario) ? req.body.testimonios_comentario : [req.body.testimonios_comentario];
            
            for (let i = 0; i < clientes.length; i++) {
                if (clientes[i]) {
                    const permiso = req.body[`testimonio_permiso_${i}`] === 'si';
                    await Testimonio.create({
                        form_id: formData.id,
                        cliente: clientes[i],
                        comentario: comentarios[i],
                        permitir_mostrar: permiso
                    });
                }
            }
        }

        // Procesar fotos de galería
        if (req.files && req.files['fotos_galeria']) {
            for (const file of req.files['fotos_galeria']) {
                await Galeria.create({
                    form_id: formData.id,
                    filename: file.filename,
                    path: file.path,
                    tipo: 'galeria'
                });
            }
        }

        req.flash('success_msg', '¡Formulario enviado correctamente!');
        res.redirect('/success');

    } catch (error) {
        console.error('Error al guardar:', error);
        req.flash('error_msg', 'Error al enviar el formulario: ' + error.message);
        res.redirect('/');
    }
});

// Ruta de éxito
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

// Ruta para ver todos los formularios (admin)
app.get('/admin', async (req, res) => {
    try {
        const forms = await FormData.findAll({
            include: [Servicio, Testimonio, Galeria],
            order: [['fecha_creacion', 'DESC']]
        });
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para ver un formulario específico
app.get('/admin/:id', async (req, res) => {
    try {
        const form = await FormData.findByPk(req.params.id, {
            include: [Servicio, Testimonio, Galeria]
        });
        if (form) {
            res.json(form);
        } else {
            res.status(404).json({ error: 'Formulario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
const PORT = process.env.PORT ||3000 ;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en https://sctechnology.sctechnology.shop/:${PORT}`);
});
