# 🃏 Droppable Sortable Example

Sistema avanzado de drag & drop con funcionalidades inteligentes de reordenamiento y combinación de elementos. Implementa un grid interactivo con panel lateral para gestión de tarjetas.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características Principales

- 🎯 **Drag & Drop Inteligente**: Sistema que diferencia entre arrastre desde sidebar y reordenamiento interno
- 🔄 **Combinación por Tipo**: Tarjetas del mismo tipo se combinan automáticamente
- 📊 **Grid Responsivo**: Layout adaptativo con indicadores visuales claros
- 🎨 **Feedback Visual Avanzado**: Líneas azules para inserción, bordes azules para combinación
- ⚡ **Reordenamiento Sin Confusión**: Placeholder grisado durante drag interno del grid
- 🧩 **Lógica Condicional**: Reglas dinámicas según el contexto de arrastre

## 🎮 Demo en Vivo

```bash
git clone https://github.com/tuusuario/droppable-sortable-example.git
cd droppable-sortable-example
npm install
npm run dev
```

Visita `http://localhost:3000/demo` para ver la demo interactiva.

## 🃏 Tipos de Tarjetas

| Tipo      | Color     | Descripción    | Combinaciones              |
| --------- | --------- | -------------- | -------------------------- |
| **Type1** | 🔵 Azul   | Tarjeta tipo 1 | Se combina con otras Type1 |
| **Type2** | 🟢 Verde  | Tarjeta tipo 2 | Se combina con otras Type2 |
| **Type3** | 🟣 Morado | Tarjeta tipo 3 | Se combina con otras Type3 |

## 📋 Paneles y Reglas

### 🏢 Panel Principal (Grid)

- ✅ **Acepta**: Todas las tarjetas desde el sidebar
- 🔄 **Combinaciones**: Habilitadas para tarjetas del mismo tipo
- 📊 **Reordenamiento**: Sin confusión visual durante drag interno
- 🎯 **Especial**: Placeholder grisado durante reordenamiento

### 🗃️ Panel Lateral (Sidebar)

- ✅ **Contiene**: Tarjetas disponibles para arrastrar
- 🔄 **Función**: Fuente de nuevas tarjetas para el grid
- 📊 **Límite**: 5 tarjetas predefinidas
- 💾 **Comportamiento**: No se reordena, solo se arrastra

## 🧩 Sistema de Combinaciones

Las combinaciones ocurren cuando arrastras una tarjeta sobre otra del mismo tipo:

```
🔵 Type1 + 🔵 Type1 = Nueva tarjeta Type1 (se inserta a la derecha)
🟢 Type2 + 🟢 Type2 = Nueva tarjeta Type2 (se inserta a la derecha)
🟣 Type3 + 🟣 Type3 = Nueva tarjeta Type3 (se inserta a la derecha)
```

### Indicadores Visuales:

- **Línea azul superior**: Inserción normal (tipos diferentes)
- **Borde azul**: Combinación disponible (mismo tipo)
- **Placeholder grisado**: Posición original durante reordenamiento interno

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Animaciones**: CSS Transitions
- **Estado**: React useState
- **Linting**: ESLint

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/droppable-sortable-example.git

# Navegar al directorio
cd droppable-sortable-example

# Instalar dependencias
npm install
# o con yarn
yarn install

# Ejecutar en modo desarrollo
npm run dev
# o
yarn dev

# Build para producción
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── demo/
│   │   └── page.tsx             # Página de demo principal
│   ├── page.tsx                 # Página de inicio
│   ├── layout.tsx               # Layout base
│   └── globals.css              # Estilos globales
├── components/
│   ├── layaut/
│   │   └── Header.tsx           # Componente de header
│   └── sections/
│       ├── Features.tsx         # Sección de características
│       └── Hero.tsx             # Sección hero
├── public/                      # Archivos estáticos
└── config files                 # Configuración del proyecto
```

## 🎯 Características Avanzadas

### Detección de Origen de Drag

```typescript
// Detecta si el drag viene del grid o del sidebar
const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id as string);
  const isFromGrid = gridItems.some((item) => item.id === event.active.id);
  setIsDraggingFromGrid(isFromGrid);
};
```

### Placeholder Inteligente

```typescript
// Muestra placeholder grisado durante reordenamiento interno
if (isDragging && isActiveItem) {
  return (
    <div className="bg-gray-200 border-2 border-dashed border-gray-300">
      {/* Contenido grisado del placeholder */}
    </div>
  )
}
```

### Combinaciones por Tipo

```typescript
// Verifica si se puede combinar (mismo tipo)
if (activeItem && overItem && activeItem.type === overItem.type) {
  // Lógica de combinación
  setGridItems((items) => {
    const overIndex = items.findIndex((item) => item.id === over.id);
    const newItems = [...items];
    newItems.splice(overIndex + 1, 0, newItem); // Insertar a la derecha
    return newItems;
  });
}
```

## 🧪 Testing

```bash
# Ejecutar linting
npm run lint

# Verificar tipos TypeScript
npm run type-check

# Build para verificar errores
npm run build
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t card-system .
docker run -p 3000:3000 card-system
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

- [ ] Persistencia de estado con localStorage
- [ ] Más tipos de tarjetas
- [ ] Animaciones más fluidas
- [ ] Modo de edición de tarjetas
- [ ] Exportar/importar configuraciones
- [ ] Temas personalizables

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**

- GitHub: [@tuusuario](https://github.com/tuusuario)
- LinkedIn: [tu-perfil](https://linkedin.com/in/tu-perfil)
- Email: tu@email.com

---

⭐ ¡Dale una estrella si te gustó el proyecto!

## 🎮 Cómo Usar

1. **Arrastrar desde Sidebar**: Toma cualquier tarjeta del panel lateral y arrástrala al grid
2. **Combinar Tarjetas**: Arrastra una tarjeta sobre otra del mismo tipo para combinarlas
3. **Reordenar**: Arrastra tarjetas dentro del grid para reordenarlas
4. **Indicadores Visuales**:
   - Línea azul = inserción normal
   - Borde azul = combinación disponible
   - Placeholder grisado = reordenamiento interno

## 📸 Características Destacadas

- ✅ **Sin Confusión Visual**: El reordenamiento interno no causa desorden visual
- ✅ **Feedback Claro**: Indicadores visuales intuitivos para cada acción
- ✅ **Combinaciones Inteligentes**: Solo tarjetas del mismo tipo se combinan
- ✅ **Responsive**: Funciona perfectamente en dispositivos móviles
