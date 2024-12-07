import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pkg from 'pg';


dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const { Pool } = pkg;
// Crear la aplicación Express
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors()); // Habilita CORS



// Configurar la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configuración SSL requerida por Supabase
  },
});


// Probar la conexión a la base de datos
pool.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos de Supabase');
});

// Middleware para parsear JSON
app.use(express.json());

//ENDPOINTS GET

app.get('/api/servicio', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM servicio');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener datos de SERVICIO:', err);
    res.status(500).json({ error: 'Error al obtener datos de SERVICIO' });
  }
});


// Endpoint para obtener clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener datos de CLIENTES:', err);
    res.status(500).json({ error: 'Error al obtener datos de CLIENTES' });
  }
});

// Endpoint para obtener agregados
app.get('/api/agregados', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM agregados');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener datos de AGREGADOS:', err);
    res.status(500).json({ error: 'Error al obtener datos de AGREGADOS' });
  }
});

// Endpoint para obtener etiquetas
app.get('/api/etiquetas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM etiquetas');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener datos de ETIQUETAS:', err);
    res.status(500).json({ error: 'Error al obtener datos de ETIQUETAS' });
  }
});

// Endpoint para obtener ubicaciones
app.get('/api/ubicaciones', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ubicacion_equipo');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener datos de UBICACION_EQUIPO:', err);
    res.status(500).json({ error: 'Error al obtener datos de UBICACION_EQUIPO' });
  }
});

// Endpoint para obtener tipos de equipo
app.get('/api/tipos_equipo', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tipos_equipo');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener datos de TIPOS_EQUIPO:', err);
    res.status(500).json({ error: 'Error al obtener datos de TIPOS_EQUIPO' });
  }
});

// Endpoint para obtener tipos de servicio
app.get('/api/tipos_servicio', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tipos_servicio');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener datos de TIPOS_SERVICIO:', err);
    res.status(500).json({ error: 'Error al obtener datos de TIPOS_SERVICIO' });
  }
});




  // Obtener un trabajador por ID
app.get('/api/trabajadores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM trabajadores WHERE id_trabajador = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    res.json(rows[0]); // Retornar el primer resultado, que será el trabajador
  } catch (err) {
    console.error('Error al obtener trabajador:', err);
    res.status(500).json({ error: 'Error al obtener trabajador' });
  }
});

// Obtener trabajadores asignados a un servicio
app.get('/api/servicio/:id_servicio/trabajadores', async (req, res) => {
  const idServicio = req.params.id_servicio;

  const query = `
    SELECT 
        t.id_trabajador,
        CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre
    FROM 
        trabajadores_servicio ts
    JOIN 
        trabajadores t ON ts.id_trabajador = t.id_trabajador
    WHERE 
        ts.id_servicio = $1;
  `;

  try {
    const { rows } = await pool.query(query, [idServicio]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener trabajadores asignados:', err);
    res.status(500).json({ error: 'Error al obtener trabajadores asignados' });
  }
});

// Obtener trabajadores disponibles
app.get('/api/servicio/:id/trabajadores-disponibles', async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT t.id_trabajador, t.nombre, t.apellido_paterno, t.apellido_materno
    FROM trabajadores t
    WHERE t.id_trabajador NOT IN (
      SELECT id_trabajador FROM trabajadores_servicio WHERE id_servicio = $1
    );
  `;

  try {
    const { rows } = await pool.query(query, [id]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener trabajadores disponibles:', err);
    res.status(500).json({ error: 'Error al obtener trabajadores disponibles' });
  }
});

// Endpoint para obtener trabajadores asignados a un servicio
app.get('/api/servicio/:id/trabajadores', async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
        t.id_trabajador, 
        t.nombre, 
        t.apellido_paterno, 
        t.apellido_materno
    FROM 
        trabajadores_servicio ts
    INNER JOIN 
        trabajadores t 
    ON 
        ts.id_trabajador = t.id_trabajador
    WHERE 
        ts.id_servicio = $1;
  `;

  try {
    const { rows } = await pool.query(query, [id]);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener trabajadores asignados:', err);
    res.status(500).json({ error: 'Error al obtener trabajadores asignados.' });
  }
});

// Endpoint para obtener todos los trabajadores
app.get('/api/trabajadores', async (req, res) => {
  const query = `
    SELECT 
        id_trabajador,
        CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) AS nombre
    FROM 
        trabajadores;
  `;

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener trabajadores:', err);
    res.status(500).json({ error: 'Error al obtener trabajadores' });
  }
});

// Endpoint para obtener todos los trabajadores con ID y equipos asignados
app.get('/api/lista-trabajadores', async (req, res) => {
  const query = `
    SELECT 
        t.id_trabajador,
        CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre,
        COUNT(ts.id_servicio) AS equiposAsignados,
        t.rango,
        t.estado
    FROM 
        trabajadores t
    LEFT JOIN 
        trabajadores_servicio ts 
    ON 
        t.id_trabajador = ts.id_trabajador
    GROUP BY 
        t.id_trabajador, t.nombre, t.apellido_paterno, t.apellido_materno, t.rango, t.estado;
  `;

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener la lista de trabajadores:', err);
    res.status(500).json({ error: 'Error al obtener la lista de trabajadores' });
  }
});

// Obtener asignaciones de trabajadores a servicios
app.get('/api/servicio/asignaciones', async (req, res) => {
  const query = `
    SELECT 
        ts.id_servicio,
        ts.id_trabajador,
        CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre
    FROM 
        trabajadores_servicio ts
    JOIN 
        trabajadores t ON ts.id_trabajador = t.id_trabajador;
  `;

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener las asignaciones:', err);
    res.status(500).json({ error: 'Error al obtener las asignaciones.' });
  }
});

// Obtener los valores del ENUM "estado"
app.get('/api/estados', async (req, res) => {
  const query = `
    SELECT enum_range(NULL::trabajadores_estado) AS estados;
  `;

  try {
    const { rows } = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Columna "estado" no encontrada' });
    }

    const estados = rows[0].estados.replace(/[{}]/g, '').split(',');
    res.status(200).json({ estados });
  } catch (err) {
    console.error('Error al obtener los estados:', err);
    res.status(500).json({ error: 'Error al obtener los estados disponibles.' });
  }
});

// Generar claves para todos los servicios
app.get('/api/generar-claves', async (req, res) => {
  try {
    const clientesQuery = 'SELECT * FROM clientes';
    const serviciosQuery = 'SELECT * FROM servicio';

    const [clientesResult, serviciosResult] = await Promise.all([
      pool.query(clientesQuery),
      pool.query(serviciosQuery),
    ]);

    const clientes = clientesResult.rows;
    const servicios = serviciosResult.rows;

    const claves = servicios.map((servicio) => {
      const cliente = clientes.find((c) => c.id_cliente === servicio.id_cliente);

      if (cliente) {
        const nombre = cliente.nombre;
        const apellidoPaterno = cliente.apellido_paterno;
        const clave = `${nombre.charAt(0)}${servicio.id_servicio}${nombre.charAt(
          nombre.length - 1
        )}${apellidoPaterno.charAt(0)}${apellidoPaterno.charAt(apellidoPaterno.length - 1)}`;

        return {
          id_servicio: servicio.id_servicio,
          clave,
        };
      }
    }).filter((item) => item !== undefined);

    res.json(claves);
  } catch (err) {
    console.error('Error al generar claves:', err);
    res.status(500).json({ error: 'Error al generar claves.' });
  }
});

// Generar clave para un servicio específico
app.get('/api/generar-claves/:id', async (req, res) => {
  const idServicio = req.params.id;

  try {
    const servicioQuery = 'SELECT * FROM servicio WHERE id_servicio = $1';
    const servicioResult = await pool.query(servicioQuery, [idServicio]);

    if (servicioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const servicio = servicioResult.rows[0];

    const clienteQuery = 'SELECT * FROM clientes WHERE id_cliente = $1';
    const clienteResult = await pool.query(clienteQuery, [servicio.id_cliente]);

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const cliente = clienteResult.rows[0];
    const nombre = cliente.nombre;
    const apellidoPaterno = cliente.apellido_paterno;
    const clave = `${nombre.charAt(0)}${servicio.id_servicio}${nombre.charAt(
      nombre.length - 1
    )}${apellidoPaterno.charAt(0)}${apellidoPaterno.charAt(apellidoPaterno.length - 1)}`;

    res.json({
      id_servicio: servicio.id_servicio,
      clave,
    });
  } catch (err) {
    console.error('Error al generar clave:', err);
    res.status(500).json({ error: 'Error al generar clave.' });
  }
});

  
// Endpoint para obtener el registro
app.get('/api/registro', async (req, res) => {
  const query = `
    SELECT 
      s.id_servicio,
      CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS cliente,
      c.domicilio,
      c.email,
      STRING_AGG(cel.celular::TEXT, ', ') AS celulares,  -- Equivalente a GROUP_CONCAT
      te.equipo AS tipo_equipo,
      a.tipo_agregado AS agregado,
      ts.servicio AS tipo_servicio,
      e.descripcion_agregado,
      e.marca,
      e.serie,
      e.modelo,
      e.estado,
      e.descripcion AS descripcion_equipo,
      s.observaciones,
      CONCAT(s.tiempo_entrega, ' ', s.medida_tiempo) AS tiempo_entrega,
      s.costo, -- Campo de costo
      TO_CHAR(s.fecha, 'DD-MM-YYYY') AS fecha -- Formato de fecha ajustado
    FROM 
      clientes c
    JOIN 
      celulares cel ON c.id_cliente = cel.id_cliente
    JOIN 
      servicio s ON c.id_cliente = s.id_cliente
    JOIN 
      equipo e ON s.id_equipo = e.id_equipo
    JOIN 
      tipos_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
    JOIN 
      agregados a ON e.id_agregados = a.id_agregados
    JOIN 
      tipos_servicio ts ON s.id_tipo_servicio = ts.id_tipo_servicio
    GROUP BY 
      c.id_cliente, s.id_servicio, te.equipo, a.tipo_agregado, ts.servicio, e.descripcion_agregado, 
      e.marca, e.serie, e.modelo, e.estado, e.descripcion, s.observaciones, s.tiempo_entrega, 
      s.medida_tiempo, s.costo, s.fecha;
  `;

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
    res.status(500).json({ error: 'Error al recuperar los datos' });
  }
});


app.get('/api/servicios/:userId', async (req, res) => {
  const userId = req.params.userId; // Obtener el ID del trabajador de los parámetros de la URL

  const query = `
    SELECT 
        s.id_servicio AS id,
        TO_CHAR(s.fecha, 'DD-MM-YYYY') AS fechaRegistro,  -- Formato de fecha
        ts.id_trabajador,
        s.prioridad,
        e.id_equipo AS id_equipo,
        e.id_tipo_equipo,
        te.equipo AS tipo_equipo,
        e.marca,
        e.serie AS noSerie,
        e.modelo,
        e.descripcion,
        e.estado,
        e.id_ubicacion,
        CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_completo,
        c.domicilio,
        c.email,
        STRING_AGG(CONCAT(ce.lada, ce.celular), ', ') AS celular_completo, -- Equivalente a GROUP_CONCAT
        CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_trabajador,
        u.ubicacion AS nombre_ubicacion
    FROM 
        servicio s
    JOIN 
        equipo e ON s.id_equipo = e.id_equipo
    JOIN 
        clientes c ON s.id_cliente = c.id_cliente
    LEFT JOIN 
        celulares ce ON c.id_cliente = ce.id_cliente
    JOIN 
        trabajadores_servicio ts ON s.id_servicio = ts.id_servicio  -- Relación con trabajadores_servicio
    JOIN 
        trabajadores t ON ts.id_trabajador = t.id_trabajador        -- Obtener información del trabajador desde trabajadores
    JOIN 
        ubicacion_equipo u ON e.id_ubicacion = u.id_ubicacion
    JOIN 
        tipos_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
    WHERE 
        ts.id_trabajador = $1  -- Filtro por ID de trabajador en trabajadores_servicio
    GROUP BY 
        s.id_servicio, ts.id_trabajador, s.prioridad, e.id_equipo, e.id_tipo_equipo, te.equipo, e.marca, e.serie, e.modelo, 
        e.descripcion, e.estado, e.id_ubicacion, c.nombre, c.apellido_paterno, c.apellido_materno, c.domicilio, c.email, 
        t.nombre, t.apellido_paterno, t.apellido_materno, u.ubicacion, s.fecha
    LIMIT 25;
  `;

  try {
    const { rows } = await pool.query(query, [userId]);

    // Transformar los resultados para que coincidan con la estructura deseada
    const transformedResults = rows.map(item => ({
      id: item.id,
      id_equipo: item.id_equipo,
      nombre: item.tipo_equipo,
      marca: item.marca,
      noSerie: item.noserie,
      modelo: item.modelo,
      estado: item.estado,
      propietario: item.nombre_trabajador,
      ubicacion: item.nombre_ubicacion,
      fechaRegistro: item.fecharegistro,
      etiqueta: 'Sin etiqueta', // Valor por defecto
      descripcion: item.descripcion,
      cliente: {
        nombre: item.nombre_completo,
        domicilio: item.domicilio,
        celulares: item.celular_completo ? item.celular_completo.split(', ') : [],
        email: item.email,
      },
    }));

    res.json(transformedResults);
  } catch (err) {
    console.error('Error al realizar la consulta:', err);
    res.status(500).json({ error: 'Error al recuperar los servicios.' });
  }
});


// Cargar servicios para el jefe
app.get('/api/servicios', async (req, res) => {
  const query = `
    SELECT 
        s.id_servicio AS id,
        TO_CHAR(s.fecha, 'DD-MM-YYYY') AS fechaRegistro,  -- Formato de fecha
        ts.id_trabajador,
        s.prioridad,
        e.id_equipo AS id_equipo,
        e.id_tipo_equipo,
        te.equipo AS tipo_equipo,
        e.marca,
        e.serie AS noSerie,
        e.modelo,
        e.descripcion,
        e.estado,
        e.id_ubicacion,
        CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS nombre_completo,
        c.domicilio,
        c.email,
        STRING_AGG(CONCAT(ce.lada, ce.celular), ', ') AS celular_completo,  -- Equivalente a GROUP_CONCAT
        CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_trabajador,
        u.ubicacion AS nombre_ubicacion
    FROM 
        servicio s
    JOIN 
        equipo e ON s.id_equipo = e.id_equipo
    JOIN 
        clientes c ON s.id_cliente = c.id_cliente
    LEFT JOIN 
        celulares ce ON c.id_cliente = ce.id_cliente
    LEFT JOIN 
        trabajadores_servicio ts ON s.id_servicio = ts.id_servicio
    LEFT JOIN 
        trabajadores t ON ts.id_trabajador = t.id_trabajador
    JOIN 
        ubicacion_equipo u ON e.id_ubicacion = u.id_ubicacion
    JOIN 
        tipos_equipo te ON e.id_tipo_equipo = te.id_tipo_equipo
    GROUP BY 
        s.id_servicio, ts.id_trabajador, s.prioridad, e.id_equipo, e.id_tipo_equipo, te.equipo, e.marca, e.serie, e.modelo, 
        e.descripcion, e.estado, e.id_ubicacion, c.nombre, c.apellido_paterno, c.apellido_materno, c.domicilio, c.email, 
        t.nombre, t.apellido_paterno, t.apellido_materno, u.ubicacion
    LIMIT 25;
  `;

  try {
    const { rows } = await pool.query(query);

    // Transformar los resultados para que coincidan con la estructura deseada
    const transformedResults = rows.map(item => ({
      id: item.id,
      id_equipo: item.id_equipo,
      nombre: item.tipo_equipo,
      marca: item.marca,
      noSerie: item.noserie,
      modelo: item.modelo,
      estado: item.estado,
      propietario: item.nombre_trabajador,
      ubicacion: item.nombre_ubicacion,
      fechaRegistro: item.fecharegistro,
      etiqueta: 'Sin etiqueta', // Valor por defecto
      descripcion: item.descripcion,
      cliente: {
        nombre: item.nombre_completo,
        domicilio: item.domicilio,
        celulares: item.celular_completo ? item.celular_completo.split(', ') : [],
        email: item.email,
      },
    }));

    res.json(transformedResults);
  } catch (err) {
    console.error('Error al realizar la consulta:', err);
    res.status(500).json({ error: 'Error al recuperar los servicios.' });
  }
});

// Endpoint para Consultar Servicios Eliminados
app.get('/api/eliminados', async (req, res) => {
  console.log('Request:', req.method, req.url);

  const selectEliminadosQuery = `
      SELECT 
          id, 
          id_servicio, 
          nombre_equipo, 
          descripcion, 
          ubicacion, 
          fecha_eliminacion, 
          nombre_duenio, 
          email_duenio
      FROM servicios_eliminados
      ORDER BY fecha_eliminacion DESC
  `;

  try {
    const { rows } = await pool.query(selectEliminadosQuery);
    console.log('Resultados obtenidos de la consulta:', rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener los servicios eliminados:', err);
    res.status(500).json({ error: 'Error al obtener los servicios eliminados' });
  }
});

// Endpoint para obtener los pasos de un cliente por servicio
app.get('/api/pasos_cliente/:id_servicio', async (req, res) => {
  const { id_servicio } = req.params;

  const query = `
      SELECT 
          id_paso_cliente, 
          paso, 
          descripcion, 
          id_servicio
      FROM pasos_clientes
      WHERE id_servicio = $1
  `;

  try {
    const { rows } = await pool.query(query, [id_servicio]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron pasos para el servicio especificado.',
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los pasos del cliente:', error);
    res.status(500).json({
      message: 'Error al obtener los pasos del servicio.',
      error: error.message,
    });
  }
});

// Endpoint para obtener notificaciones
app.get('/api/notificaciones', async (req, res) => {
  const query = `
      SELECT 
          n.id_notificacion,
          n.tipo,
          n.id_servicio,
          n.id_trabajador,
          n.id_destinatario,
          CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_trabajador,
          s.id_equipo
      FROM 
          notificaciones n
      LEFT JOIN 
          trabajadores t ON n.id_trabajador = t.id_trabajador
      LEFT JOIN 
          servicio s ON n.id_servicio = s.id_servicio
  `;

  try {
    const { rows } = await pool.query(query);

    const transformedResults = rows.map(item => ({
      id_notificacion: item.id_notificacion,
      id_servicio: item.id_servicio,
      id_equipo: item.id_equipo,
      id_trabajador: item.id_trabajador,
      id_destinatario: item.id_destinatario,
      tipo: item.tipo,
      nombre_trabajador: item.nombre_trabajador,
    }));

    res.json(transformedResults);
  } catch (err) {
    console.error('Error al obtener notificaciones:', err);
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
});


// Endpoint para Consultar Servicios Eliminados
app.get('/api/eliminados', async (req, res) => {
  console.log('Request:', req.method, req.url);

  const selectEliminadosQuery = `
      SELECT 
          id, 
          id_servicio, 
          nombre_equipo, 
          descripcion, 
          ubicacion, 
          fecha_eliminacion, 
          nombre_duenio, 
          email_duenio
      FROM servicios_eliminados
      ORDER BY fecha_eliminacion DESC
  `;

  try {
    const { rows } = await pool.query(selectEliminadosQuery);
    console.log('Resultados obtenidos de la consulta:', rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener los servicios eliminados:', err);
    res.status(500).json({ error: 'Error al obtener los servicios eliminados' });
  }
});

// Endpoint para obtener los pasos de un cliente por servicio
app.get('/api/pasos_cliente/:id_servicio', async (req, res) => {
  const { id_servicio } = req.params;

  const query = `
      SELECT 
          id_paso_cliente, 
          paso, 
          descripcion, 
          id_servicio
      FROM pasos_clientes
      WHERE id_servicio = $1
  `;

  try {
    const { rows } = await pool.query(query, [id_servicio]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron pasos para el servicio especificado.',
      });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los pasos del cliente:', error);
    res.status(500).json({
      message: 'Error al obtener los pasos del servicio.',
      error: error.message,
    });
  }
});

// Endpoint para obtener notificaciones
app.get('/api/notificaciones', async (req, res) => {
  const query = `
      SELECT 
          n.id_notificacion,
          n.tipo,
          n.id_servicio,
          n.id_trabajador,
          n.id_destinatario,
          CONCAT(t.nombre, ' ', t.apellido_paterno, ' ', t.apellido_materno) AS nombre_trabajador,
          s.id_equipo
      FROM 
          notificaciones n
      LEFT JOIN 
          trabajadores t ON n.id_trabajador = t.id_trabajador
      LEFT JOIN 
          servicio s ON n.id_servicio = s.id_servicio
  `;

  try {
    const { rows } = await pool.query(query);

    const transformedResults = rows.map(item => ({
      id_notificacion: item.id_notificacion,
      id_servicio: item.id_servicio,
      id_equipo: item.id_equipo,
      id_trabajador: item.id_trabajador,
      id_destinatario: item.id_destinatario,
      tipo: item.tipo,
      nombre_trabajador: item.nombre_trabajador,
    }));

    res.json(transformedResults);
  } catch (err) {
    console.error('Error al obtener notificaciones:', err);
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
});


// Endpoint para obtener las cotizaciones de servicio filtradas por id_servicio
app.get('/api/cotizacion_servicio/:id_servicio', async (req, res) => {
  const idServicio = req.params.id_servicio;

  const query = `
    SELECT descripcion, precio 
    FROM cotizacion_servicio 
    WHERE id_servicio = $1
  `;

  try {
    const { rows } = await pool.query(query, [idServicio]);
    const cotizaciones = rows.map(row => ({
      descripcion: row.descripcion,
      precio: row.precio,
    }));

    res.json(cotizaciones);
  } catch (err) {
    console.error('Error al obtener las cotizaciones de servicio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener las piezas de cotización filtradas por id_servicio
app.get('/api/cotizacion_piezas/:id_servicio', async (req, res) => {
  const idServicio = req.params.id_servicio;

  const query = `
    SELECT * 
    FROM cotizacion_piezas 
    WHERE id_servicio = $1
  `;

  try {
    const { rows } = await pool.query(query, [idServicio]);
    const piezas = rows.map(row => ({
      nombre: row.nombre,
      costo: row.costo,
      estado: row.estado,
      idPieza: row.id_cotizacion,
      observaciones: row.observaciones,
      tiempo_entrega: row.tiempo_entrega,
      cancelacion: row.estado_cancelacion,
    }));

    res.json(piezas);
  } catch (err) {
    console.error('Error al obtener las piezas de cotización:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener el servicio por id_equipo
app.get('/api/servicio/:id_equipo', async (req, res) => {
  const { id_equipo } = req.params;

  const query = 'SELECT id_servicio FROM servicio WHERE id_equipo = $1';

  try {
    const { rows } = await pool.query(query, [id_equipo]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron servicios para el id_equipo proporcionado.' });
    }
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener el servicio por id_equipo:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener detalles del equipo
app.get('/api/detalles/:id', async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      e.marca AS nombre_equipo, 
      e.modelo, 
      e.estado, 
      CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS propietario, 
      STRING_AGG(CONCAT('+', cl.lada, cl.celular), ', ') AS numeros_contacto, 
      s.observaciones AS descripcion_problema,
      s.id_servicio,
      c.email
    FROM equipo e
    LEFT JOIN servicio s ON e.id_equipo = s.id_equipo
    LEFT JOIN clientes c ON s.id_cliente = c.id_cliente
    LEFT JOIN celulares cl ON c.id_cliente = cl.id_cliente
    WHERE e.id_equipo = $1
    GROUP BY e.id_equipo, c.id_cliente, s.id_servicio
    LIMIT 1;
  `;

  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para los pasos del servicio
app.get('/api/pasos', async (req, res) => {
  const { id_servicio } = req.query;

  let query = `
    SELECT 
      ps.nombre_paso,
      ps.descripcion_general,
      s.id_servicio,
      CONCAT(s.tiempo_entrega, ' ', s.medida_tiempo) AS tiempo_entrega,
      s.costo
    FROM 
      pasos_de_servicio ps
    INNER JOIN 
      servicio s ON ps.id_servicio = s.id_servicio
  `;

  const params = [];
  if (id_servicio) {
    query += ` WHERE s.id_servicio = $1`;
    params.push(id_servicio);
  }

  try {
    const { rows } = await pool.query(query, params);
    const formattedResults = rows.map(item => ({
      title: item.nombre_paso,
      details: item.descripcion_general,
      estimatedCost: item.costo,
      estimatedTime: item.tiempo_entrega,
      id_servicio: item.id_servicio
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error('Error al obtener los pasos del servicio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los pasos para un servicio específico
app.get('/api/pasos/:idServicio', async (req, res) => {
  const { idServicio } = req.params;

  const query = `SELECT * FROM pasos_de_servicio WHERE id_servicio = $1`;

  try {
    const { rows } = await pool.query(query, [idServicio]);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener los pasos del servicio:', err);
    res.status(500).json({ error: err.message });
  }
});



//ENDPOINTS POST


app.post('/api/etiquetas', async (req, res) => {
  const { etiqueta, id_servicio } = req.body; // Extrae los datos del cuerpo de la petición

  // Verifica que se haya proporcionado el campo 'etiqueta'
  if (!etiqueta) {
    return res.status(400).json({ error: 'El campo etiqueta es obligatorio.' });
  }

  // Query para insertar la nueva etiqueta en la tabla
  const query = 'INSERT INTO etiquetas (etiqueta, id_servicio) VALUES ($1, $2) RETURNING id_etiqueta';

  try {
    const { rows } = await pool.query(query, [etiqueta, id_servicio]);

    // Devuelve la nueva etiqueta creada
    res.status(201).json({ id_etiqueta: rows[0].id_etiqueta, etiqueta, id_servicio });
  } catch (err) {
    console.error('Error al insertar la etiqueta:', err);
    res.status(500).json({ error: 'Error al insertar la etiqueta.' });
  }
});


app.post('/api/etiquetas/:id_servicio', async (req, res) => {
  const { id_servicio } = req.params; // Obtener id_servicio de los parámetros de la URL
  const { etiqueta } = req.body; // Obtener etiqueta del cuerpo de la solicitud

  // Validación de entrada
  if (!id_servicio || !etiqueta) {
    return res.status(400).json({ error: 'id_servicio y etiqueta son obligatorios' });
  }

  // Query para insertar la etiqueta
  const query = 'INSERT INTO etiquetas (etiqueta, id_servicio) VALUES ($1, $2) RETURNING id_etiqueta';

  try {
    const { rows } = await pool.query(query, [etiqueta, id_servicio]);

    res.status(201).json({
      message: 'Etiqueta creada exitosamente',
      id_etiqueta: rows[0].id_etiqueta, // ID generado automáticamente
      etiqueta,
      id_servicio,
    });
  } catch (err) {
    console.error('Error al insertar la etiqueta:', err);
    res.status(500).json({ error: 'Error al insertar la etiqueta en la base de datos' });
  }
});

  
app.post('/api/tipos_servicio', async (req, res) => {
  const { servicio } = req.body;

  if (!servicio) {
    return res.status(400).json({ error: 'El campo "servicio" es obligatorio.' });
  }

  try {
    const query = 'INSERT INTO tipos_servicio (servicio) VALUES ($1) RETURNING id_tipo_servicio';
    const { rows } = await pool.query(query, [servicio]);

    res.status(201).json({ message: 'Tipo de servicio agregado', id_tipo_servicio: rows[0].id_tipo_servicio });
  } catch (error) {
    console.error('Error al agregar tipo de servicio:', error);
    res.status(500).json({ error: 'Error al agregar tipo de servicio.' });
  }
});

  
  
app.post('/api/pasos_cliente/:id_servicio', async (req, res) => {
  const { id_servicio } = req.params;
  const { paso, descripcion } = req.body;

  if (!paso || !id_servicio) {
    return res.status(400).json({ message: 'El campo "paso" y "id_servicio" son obligatorios.' });
  }

  try {
    const query = 'INSERT INTO pasos_clientes (paso, descripcion, id_servicio) VALUES ($1, $2, $3) RETURNING id_paso_cliente';
    const { rows } = await pool.query(query, [paso, descripcion, id_servicio]);

    res.status(201).json({ message: 'Paso creado exitosamente.', id_paso_cliente: rows[0].id_paso_cliente });
  } catch (error) {
    console.error('Error al agregar paso:', error);
    res.status(500).json({ error: 'Error al agregar el paso.' });
  }
});




app.post('/api/tipos_equipo', async (req, res) => {
  const { equipo } = req.body;

  if (!equipo) {
    return res.status(400).json({ error: 'El campo "equipo" es obligatorio.' });
  }

  try {
    const query = 'INSERT INTO tipos_equipo (equipo) VALUES ($1) RETURNING id_tipo_equipo';
    const { rows } = await pool.query(query, [equipo]);

    res.status(201).json({ message: 'Tipo de equipo agregado', id_tipo_equipo: rows[0].id_tipo_equipo });
  } catch (error) {
    console.error('Error al agregar tipo de equipo:', error);
    res.status(500).json({ error: 'Error al agregar tipo de equipo.' });
  }
});

  
app.post('/api/agregados', async (req, res) => {
  const { tipoAgregado } = req.body;

  if (!tipoAgregado) {
    return res.status(400).json({ error: 'El campo "tipoAgregado" es obligatorio.' });
  }

  try {
    const query = 'INSERT INTO agregados (tipo_agregado) VALUES ($1) RETURNING id_agregados';
    const { rows } = await pool.query(query, [tipoAgregado]);

    res.status(201).json({ message: 'Agregado agregado', id_agregado: rows[0].id_agregados });
  } catch (error) {
    console.error('Error al agregar agregado:', error);
    res.status(500).json({ error: 'Error al agregar agregado.' });
  }
});


app.post('/submitForm', async (req, res) => {
  const { cliente, celular, equipo, servicio } = req.body;

  const client = await pool.connect();

  try {
      // Iniciar la transacción
      await client.query('BEGIN');

      // Insertar cliente
      const clienteQuery = `
          INSERT INTO clientes (nombre, apellido_paterno, apellido_materno, domicilio, email)
          VALUES ($1, $2, $3, $4, $5) RETURNING id_cliente
      `;
      const clienteResult = await client.query(clienteQuery, [
          cliente.nombre,
          cliente.apellidoPaterno,
          cliente.apellidoMaterno,
          cliente.domicilio,
          cliente.email
      ]);
      const idCliente = clienteResult.rows[0].id_cliente;

      // Insertar celulares
      const celularPromises = celular.celulares.map(cel => {
          const celularQuery = `
              INSERT INTO celulares (lada, celular, id_cliente)
              VALUES ($1, $2, $3)
          `;
          return client.query(celularQuery, [cel.lada, cel.numero, idCliente]);
      });
      await Promise.all(celularPromises);

      // Insertar equipo
      const equipoQuery = `
          INSERT INTO equipo (marca, serie, modelo, descripcion, estado, descripcion_agregado, id_tipo_equipo, id_agregados)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_equipo
      `;
      const equipoResult = await client.query(equipoQuery, [
          equipo.marca,
          equipo.serie,
          equipo.modelo,
          equipo.descripcion,
          equipo.estado,
          equipo.descripcionAgregado,
          equipo.idTipoEquipo,
          equipo.idAgregados
      ]);
      const idEquipo = equipoResult.rows[0].id_equipo;

      // Insertar servicio
      const servicioQuery = `
          INSERT INTO servicio (observaciones, tiempo_entrega, medida_tiempo, id_cliente, id_equipo, id_tipo_servicio, costo, prioridad)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_servicio
      `;
      const servicioResult = await client.query(servicioQuery, [
          servicio.observaciones,
          servicio.tiempo_entrega,
          servicio.medida_tiempo,
          idCliente,
          idEquipo,
          servicio.id_tipo_servicio,
          servicio.costo,
          servicio.prioridad
      ]);
      const idServicio = servicioResult.rows[0].id_servicio;

      // Insertar en trabajadores_servicio
      const trabajadorServicioQuery = `
          INSERT INTO trabajadores_servicio (id_trabajador, id_servicio)
          VALUES ($1, $2)
      `;
      await client.query(trabajadorServicioQuery, [servicio.id_trabajador, idServicio]);

      // Insertar notificación
      const notificacionQuery = `
          INSERT INTO notificaciones (tipo, id_servicio, id_trabajador, id_destinatario)
          VALUES ($1, $2, $3, $4)
      `;
      await client.query(notificacionQuery, ['nuevo_servicio', idServicio, servicio.id_trabajador, 1]);

      // Finalizar la transacción
      await client.query('COMMIT');

      // Responder con éxito
      res.json({ success: true, id_servicio: idServicio });
  } catch (err) {
      // Revertir la transacción en caso de error
      await client.query('ROLLBACK');
      console.error('Error al procesar la transacción:', err.message);
      res.status(500).json({ error: 'Error al procesar la transacción.' });
  } finally {
      // Liberar el cliente de la conexión
      client.release();
  }
});



app.post('/api/login', async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  try {
      // Buscar el trabajador en la base de datos
      const query = 'SELECT * FROM trabajadores WHERE "user" = $1';
      const result = await pool.query(query, [user]);

      if (result.rows.length === 0) {
          return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const trabajador = result.rows[0];

      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const match = await bcrypt.compare(password, trabajador.password);

      if (!match) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Obtener el rol del trabajador desde la columna rango
      const role = trabajador.rango;

      // Generar token JWT con el ID del usuario y el rol
      const token = jwt.sign({ userId: trabajador.id_trabajador, role }, SECRET_KEY, { expiresIn: '1h' });

      // Responder con el token, ID del trabajador y el rol
      return res.status(200).json({
          message: 'Inicio de sesión exitoso',
          token,
          userId: trabajador.id_trabajador,
          role, // Retorna el rol desde la columna rango
      });
  } catch (err) {
      console.error('Error en el inicio de sesión:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
});







// Endpoint para agregar una nueva cotización de servicio
app.post('/api/cotizacion_servicio', async (req, res) => {
  const { descripcion, precio, id_servicio } = req.body;

  const query = 'INSERT INTO cotizacion_servicio (descripcion, precio, id_servicio) VALUES ($1, $2, $3) RETURNING id_cotizacion';

  try {
      const result = await pool.query(query, [descripcion, precio, id_servicio]);
      res.status(201).json({ id_cotizacion: result.rows[0].id_cotizacion });
  } catch (err) {
      console.error('Error al agregar cotización de servicio:', err);
      res.status(500).json({ error: 'Error al agregar cotización de servicio' });
  }
});




// Endpoint POST para agregar una nueva cotización de pieza
app.post('/api/cotizacion_piezas', async (req, res) => {
  const { nombre, costo, tiempo_entrega, id_servicio } = req.body;

  if (!nombre || !costo || !tiempo_entrega || !id_servicio) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const query = `
      INSERT INTO cotizacion_piezas (nombre, costo, tiempo_entrega, id_servicio)
      VALUES ($1, $2, $3, $4) RETURNING id_cotizacion
  `;

  try {
      const result = await pool.query(query, [nombre, costo, tiempo_entrega, id_servicio]);
      res.status(201).json({
          message: 'Cotización de pieza creada con éxito',
          id_cotizacion: result.rows[0].id_cotizacion
      });
  } catch (err) {
      console.error('Error al agregar cotización de pieza:', err);
      res.status(500).json({ error: 'Error al agregar cotización de pieza' });
  }
});





// Endpoint para agregar un nuevo paso de servicio
app.post('/api/pasos', async (req, res) => {
  const { id_servicio, nombre_paso, descripcion_general, id_trabajador, nombre_trabajador } = req.body;

  const query = `
      INSERT INTO pasos_de_servicio (id_servicio, nombre_paso, descripcion_general, id_trabajador, nombre_trabajador)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_paso
  `;

  try {
      const result = await pool.query(query, [id_servicio, nombre_paso, descripcion_general, id_trabajador, nombre_trabajador]);
      res.status(201).json({
          message: 'Paso de servicio agregado correctamente',
          id_paso: result.rows[0].id_paso
      });
  } catch (err) {
      console.error('Error al agregar paso de servicio:', err);
      res.status(500).json({ error: 'Error al agregar paso de servicio' });
  }
});




// Asignar un trabajador a un servicio
app.post('/api/asignar-trabajador', async (req, res) => {
  const { id_servicio, id_trabajador } = req.body;

  console.log('Datos recibidos en asignar:', req.body);

  if (!id_servicio || !id_trabajador) {
      return res.status(400).json({ error: 'id_servicio e id_trabajador son requeridos.' });
  }

  const query = `
      INSERT INTO trabajadores_servicio (id_servicio, id_trabajador)
      VALUES ($1, $2)
      ON CONFLICT (id_servicio, id_trabajador) DO NOTHING
      RETURNING *;
  `;

  try {
      const result = await pool.query(query, [id_servicio, id_trabajador]);
      if (result.rowCount === 0) {
          return res.status(400).json({ error: 'El trabajador ya está asignado a este servicio.' });
      }
      res.json({ message: 'Trabajador asignado exitosamente.' });
  } catch (err) {
      console.error('Error al asignar trabajador:', err);
      res.status(500).json({ error: 'Error interno al asignar trabajador.' });
  }
});


// Desasignar un trabajador de un servicio
app.post('/api/desasignar-trabajador', async (req, res) => {
  const { id_servicio, id_trabajador } = req.body;

  console.log('Datos recibidos en desasignar:', req.body);

  if (!id_servicio || !id_trabajador) {
      return res.status(400).json({ error: 'id_servicio e id_trabajador son requeridos.' });
  }

  const query = `
      DELETE FROM trabajadores_servicio 
      WHERE id_servicio = $1 AND id_trabajador = $2
      RETURNING *;
  `;

  try {
      const result = await pool.query(query, [id_servicio, id_trabajador]);
      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'No se encontró la relación para desasignar.' });
      }
      res.json({ message: 'Trabajador desasignado exitosamente.' });
  } catch (err) {
      console.error('Error al desasignar trabajador:', err);
      res.status(500).json({ error: 'Error interno al desasignar trabajador.' });
  }
});

app.post('/notificaciones', async (req, res) => {
  const { tipo, id_servicio, id_trabajador, id_destinatario } = req.body;

  if (!tipo || !id_servicio || !id_trabajador || !id_destinatario) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  const query = `
      INSERT INTO notificaciones (tipo, id_servicio, id_trabajador, id_destinatario, fecha_creacion)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id_notificacion;
  `;

  try {
      const result = await pool.query(query, [tipo, id_servicio, id_trabajador, id_destinatario]);
      res.status(201).json({
          message: 'Notificación creada exitosamente.',
          notificacionId: result.rows[0].id_notificacion,
      });
  } catch (err) {
      console.error('Error al insertar la notificación:', err);
      res.status(500).json({ error: 'Error al insertar la notificación.' });
  }
});




// Endpoint para crear un nuevo trabajador
app.post('/api/alta-trabajador', async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, password, rango } = req.body;

  // Verificar campos obligatorios
  if (!nombre || !apellido_paterno || !apellido_materno || !password || !rango) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Generar el campo 'user'
  const user = `${nombre}${apellido_paterno.charAt(0).toUpperCase()}${apellido_materno.charAt(0).toUpperCase()}`;

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Query para insertar el trabajador
    const query = `
      INSERT INTO trabajadores (nombre, apellido_paterno, apellido_materno, "user", password, rango, estado)
      VALUES ($1, $2, $3, $4, $5, $6, 'disponible')
      RETURNING id_trabajador;
    `;

    // Ejecutar la consulta
    const result = await pool.query(query, [
      nombre,
      apellido_paterno,
      apellido_materno,
      user,
      hashedPassword,
      rango,
    ]);

    // Responder con éxito
    res.status(201).json({
      message: 'Trabajador creado exitosamente',
      id: result.rows[0].id_trabajador,
      user,
    });
  } catch (err) {
    console.error('Error al crear el trabajador:', err);

    if (err.code === '23505') { // Código de error de duplicado en PostgreSQL
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    res.status(500).json({ error: 'Error al crear el trabajador' });
  }
});




//ENDPOINTS PUT
// Endpoint para actualizar el estado de un trabajador
// Endpoint para actualizar el estado de un trabajador
app.put('/api/trabajadores/estado/:id', async (req, res) => {
  const { id } = req.params; // ID del trabajador
  const { estado } = req.body; // Nuevo estado a establecer

  // Verificar si el estado es válido
  const estadosValidos = ['disponible', 'instalacion_fuera', 'servicio_a_domicilio', 'entregando_equipo'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  try {
    const query = `
      UPDATE trabajadores
      SET estado = $1
      WHERE id_trabajador = $2
      RETURNING *;
    `;

    const { rowCount } = await pool.query(query, [estado, id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    res.status(200).json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del trabajador:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del trabajador' });
  }
});


//REVISAR
// Endpoint para actualizar el estado de un trabajador
// Endpoint para actualizar el estado de un trabajador
app.put('/api/trabajadores/:id/estado', async (req, res) => {
  console.log('Petición recibida para actualizar estado:', req.params, req.body);
  const { id } = req.params; // ID del trabajador
  const { estado } = req.body; // Nuevo estado a establecer

  // Lista de estados válidos
  const estadosValidos = ['disponible', 'instalacion_fuera', 'servicio_a_domicilio', 'entregando_equipo'];
  if (!estadosValidos.includes(estado)) {
    console.error('Estado no válido:', estado);
    return res.status(400).json({ error: 'Estado no válido' });
  }

  try {
    // Actualizar el estado del trabajador
    const query = `
      UPDATE trabajadores
      SET estado = $1
      WHERE id_trabajador = $2
      RETURNING *;
    `;
    const values = [estado, id];

    const { rowCount, rows } = await pool.query(query, values);
    console.log('Resultado de la consulta:', rows);

    if (rowCount === 0) {
      console.error('Trabajador no encontrado para ID:', id);
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    res.status(200).json({ message: 'Estado actualizado correctamente', trabajador: rows[0] });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ error: 'Error al actualizar el estado del trabajador' });
  }
});


// Endpoint para actualizar una cotización de pieza
app.put('/api/cotizacion_piezas/:id_cotizacion', async (req, res) => {
  const { id_cotizacion } = req.params;
  const { nombre, costo, estado, observaciones, tiempo_entrega, estado_cancelacion } = req.body;

  try {
    const query = `
      UPDATE cotizacion_piezas
      SET 
        nombre = $1,
        costo = $2,
        estado = $3,
        observaciones = $4,
        tiempo_entrega = $5,
        estado_cancelacion = $6
      WHERE id_cotizacion = $7
      RETURNING *;
    `;

    const { rowCount } = await pool.query(query, [
      nombre,
      costo,
      estado,
      observaciones,
      tiempo_entrega,
      estado_cancelacion,
      id_cotizacion,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada.' });
    }

    res.status(200).json({ message: 'Cotización actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar la cotización:', error);
    res.status(500).json({ error: 'Error al actualizar la cotización.' });
  }
});









// Actualizar un paso específico
// Endpoint para actualizar un paso específico
app.put('/api/pasos/:idPaso', async (req, res) => {
  const { idPaso } = req.params;
  const { nombre_paso, descripcion_general, completado } = req.body;

  try {
    const query = `
      UPDATE pasos_de_servicio
      SET 
        nombre_paso = $1,
        descripcion_general = $2,
        completado = $3
      WHERE id_paso = $4
      RETURNING *;
    `;

    const { rowCount } = await pool.query(query, [
      nombre_paso,
      descripcion_general,
      completado,
      idPaso,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Paso no encontrado.' });
    }

    res.status(200).json({ message: 'Paso de servicio actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el paso:', error);
    res.status(500).json({ error: 'Error al actualizar el paso.' });
  }
});





//ENDPOINTS DELETE

// Eliminar a un usuario
app.delete('/api/eliminar-trabajador/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // Queries SQL para eliminar relaciones y trabajador
  const deleteAssignmentsQuery = 'DELETE FROM trabajadores_servicio WHERE id_trabajador = $1';
  const deleteTrabajadorQuery = 'DELETE FROM trabajadores WHERE id_trabajador = $1';

  try {
    // Iniciar una transacción
    await pool.query('BEGIN');

    // Eliminar asignaciones en trabajadores_servicio
    await pool.query(deleteAssignmentsQuery, [id]);

    // Eliminar al trabajador
    const { rowCount } = await pool.query(deleteTrabajadorQuery, [id]);

    if (rowCount === 0) {
      // Si no se eliminó ningún trabajador, hacer rollback
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    // Confirmar la transacción
    await pool.query('COMMIT');
    res.status(200).json({ message: 'Trabajador eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el trabajador:', error);
    await pool.query('ROLLBACK'); // Revertir los cambios si ocurre un error
    res.status(500).json({ error: 'Error al eliminar el trabajador' });
  }
});







// Endpoint para eliminar servicios
app.delete('/api/servicios/:id', async (req, res) => {
  console.log('Request received to delete service with ID:', req.params.id);
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const selectServicioQuery = `
      SELECT 
          servicio.id_servicio, 
          equipo.modelo AS nombre_equipo, 
          equipo.descripcion AS descripcion, 
          equipo.id_ubicacion AS ubicacion,
          CONCAT(clientes.nombre, ' ', clientes.apellido_paterno, ' ', clientes.apellido_materno) AS nombre_duenio,
          clientes.email AS email_duenio
      FROM servicio
      INNER JOIN equipo ON servicio.id_equipo = equipo.id_equipo
      INNER JOIN clientes ON servicio.id_cliente = clientes.id_cliente
      WHERE servicio.id_servicio = $1
  `;

  const insertServicioEliminadoQuery = `
      INSERT INTO servicios_eliminados (id_servicio, nombre_equipo, descripcion, ubicacion, nombre_duenio, email_duenio) 
      VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const deleteTrabajadoresQuery = 'DELETE FROM trabajadores_servicio WHERE id_servicio = $1';
  const deletePasosQuery = 'DELETE FROM pasos_de_servicio WHERE id_servicio = $1';
  const deleteCotizacionServicioQuery = 'DELETE FROM cotizacion_servicio WHERE id_servicio = $1';
  const deleteCotizacionPiezasQuery = 'DELETE FROM cotizacion_piezas WHERE id_servicio = $1';
  const deleteEtiquetasQuery = 'DELETE FROM etiquetas WHERE id_servicio = $1';
  const deleteServicioQuery = 'DELETE FROM servicio WHERE id_servicio = $1';

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Iniciar la transacción

    // Obtener datos del servicio
    const servicioResults = await client.query(selectServicioQuery, [id]);
    if (servicioResults.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const servicio = servicioResults.rows[0];

    // Registrar el servicio eliminado
    await client.query(insertServicioEliminadoQuery, [
      servicio.id_servicio,
      servicio.nombre_equipo,
      servicio.descripcion,
      servicio.ubicacion,
      servicio.nombre_duenio,
      servicio.email_duenio,
    ]);

    // Eliminar registros relacionados en orden
    await client.query(deleteTrabajadoresQuery, [id]);
    await client.query(deletePasosQuery, [id]);
    await client.query(deleteCotizacionServicioQuery, [id]);
    await client.query(deleteCotizacionPiezasQuery, [id]);
    await client.query(deleteEtiquetasQuery, [id]);

    // Eliminar el servicio
    const deleteResult = await client.query(deleteServicioQuery, [id]);
    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    await client.query('COMMIT'); // Confirmar la transacción
    res.status(200).json({ message: 'Servicio y registros relacionados eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar el servicio:', error);
    await client.query('ROLLBACK'); // Revertir los cambios en caso de error
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  } finally {
    client.release(); // Liberar el cliente
  }
});









// Endpoint para eliminar una notificación
app.delete('/api/notificaciones/:id_notificacion', async (req, res) => {
  const { id_notificacion } = req.params; // Obtener el ID de la notificación desde los parámetros de la URL

  const query = `
      DELETE FROM notificaciones
      WHERE id_notificacion = $1;
  `;

  try {
    const { rowCount } = await pool.query(query, [id_notificacion]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Notificación no encontrada" }); // Si no se encontró ninguna notificación
    }
    res.json({ message: "Notificación eliminada exitosamente" }); // Confirmar eliminación exitosa
  } catch (err) {
    console.error("Error al eliminar la notificación:", err);
    res.status(500).json({ error: "Error interno al eliminar la notificación" });
  }
});







// Endpoint para eliminar un paso específico
app.delete('/api/pasos/:idPaso', async (req, res) => {
  const { idPaso } = req.params;

  const query = `
      DELETE FROM pasos_de_servicio
      WHERE id_paso = $1;
  `;

  try {
    const { rowCount } = await pool.query(query, [idPaso]);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Paso de servicio no encontrado" });
    }
    res.status(200).json({ message: "Paso de servicio eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar el paso de servicio:", err);
    res.status(500).json({ error: "Error interno al eliminar el paso de servicio" });
  }
});



// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
