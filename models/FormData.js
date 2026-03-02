const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FormularioWeb = sequelize.define('FormularioWeb', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Datos del negocio
    negocio_nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    negocio_eslogan: DataTypes.STRING(255),
    negocio_giro: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    negocio_experiencia: DataTypes.STRING(50),
    negocio_descripcion: DataTypes.TEXT,
    
    // Colores
    color_principal: DataTypes.STRING(20),
    color_secundario: DataTypes.STRING(20),
    color_fondo: DataTypes.STRING(20),
    tiene_logo: DataTypes.BOOLEAN,
    necesita_logo: DataTypes.BOOLEAN,
    logo_filename: DataTypes.STRING(255),
    logo_path: DataTypes.STRING(255),
    
    // Sección Inicio
    inicio_tiene_foto: DataTypes.BOOLEAN,
    inicio_tipo_imagen: DataTypes.STRING(50),
    inicio_descripcion_imagen: DataTypes.TEXT,
    inicio_botones: DataTypes.TEXT, // JSON string
    inicio_otro_boton: DataTypes.STRING(255),
    
    // Sobre Nosotros
    sobre_historia: DataTypes.TEXT,
    sobre_mision: DataTypes.TEXT,
    sobre_valores: DataTypes.STRING(255),
    sobre_mostrar_equipo: DataTypes.BOOLEAN,
    sobre_foto_fundador_filename: DataTypes.STRING(255),
    
    // Contacto
    contacto_telefono_fijo: DataTypes.STRING(50),
    contacto_telefono_celular: DataTypes.STRING(50),
    contacto_whatsapp: DataTypes.STRING(50),
    contacto_email: DataTypes.STRING(100),
    contacto_direccion: DataTypes.TEXT,
    contacto_como_llegar: DataTypes.TEXT,
    contacto_horario: DataTypes.STRING(255),
    
    // Redes Sociales
    redes_facebook_tiene: DataTypes.BOOLEAN,
    redes_facebook_link: DataTypes.STRING(255),
    redes_instagram_tiene: DataTypes.BOOLEAN,
    redes_instagram_link: DataTypes.STRING(255),
    redes_twitter_tiene: DataTypes.BOOLEAN,
    redes_twitter_link: DataTypes.STRING(255),
    redes_tiktok_tiene: DataTypes.BOOLEAN,
    redes_tiktok_link: DataTypes.STRING(255),
    redes_youtube_tiene: DataTypes.BOOLEAN,
    redes_youtube_link: DataTypes.STRING(255),
    redes_linkedin_tiene: DataTypes.BOOLEAN,
    redes_linkedin_link: DataTypes.STRING(255),
    
    // Google Maps
    maps_mostrar: DataTypes.BOOLEAN,
    maps_direccion: DataTypes.TEXT,
    maps_codigo: DataTypes.TEXT,
    
    // Preguntas adicionales
    objetivos: DataTypes.TEXT, // JSON string
    otro_objetivo: DataTypes.STRING(255),
    competencia: DataTypes.TEXT,
    paginas_inspiracion: DataTypes.TEXT,
    contenido_extra: DataTypes.TEXT,
    
    // Confirmación
    responsable_nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    responsable_telefono: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    responsable_email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    preferencia_contacto: DataTypes.STRING(20),
    fecha_limite: DataTypes.DATEONLY,
    
    // Metadatos
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente'
    }
}, {
    tableName: 'formularios_web',
    timestamps: false
});

// Tablas relacionadas para servicios y testimonios
const Servicio = sequelize.define('Servicio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    form_id: {
        type: DataTypes.INTEGER,
        references: {
            model: FormularioWeb,
            key: 'id'
        }
    },
    nombre: DataTypes.STRING(255),
    descripcion: DataTypes.TEXT,
    icono: DataTypes.STRING(100)
}, {
    tableName: 'servicios',
    timestamps: false
});

const Testimonio = sequelize.define('Testimonio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    form_id: {
        type: DataTypes.INTEGER,
        references: {
            model: FormularioWeb,
            key: 'id'
        }
    },
    cliente: DataTypes.STRING(255),
    comentario: DataTypes.TEXT,
    permitir_mostrar: DataTypes.BOOLEAN
}, {
    tableName: 'testimonios',
    timestamps: false
});

const Galeria = sequelize.define('Galeria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    form_id: {
        type: DataTypes.INTEGER,
        references: {
            model: FormularioWeb,
            key: 'id'
        }
    },
    filename: DataTypes.STRING(255),
    path: DataTypes.STRING(255),
    tipo: DataTypes.STRING(50)
}, {
    tableName: 'galeria',
    timestamps: false
});

// Establecer relaciones
FormularioWeb.hasMany(Servicio, { foreignKey: 'form_id' });
FormularioWeb.hasMany(Testimonio, { foreignKey: 'form_id' });
FormularioWeb.hasMany(Galeria, { foreignKey: 'form_id' });

module.exports = { FormularioWeb, Servicio, Testimonio, Galeria };
