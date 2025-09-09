"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type CardType = "type1" | "type2" | "type3";

interface GridItem {
  id: string;
  name: string;
  color: string;
  type: CardType;
}

interface SidebarItem {
  id: string;
  name: string;
  color: string;
  type: CardType;
}

// Componente para items del grid
function GridItemComponent({
  item,
  isOverlay = false,
  canCombine = false,
  isDraggingFromGrid = false,
  isActiveItem = false,
}: {
  item: GridItem;
  isOverlay?: boolean;
  canCombine?: boolean;
  isDraggingFromGrid?: boolean;
  isActiveItem?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: item.id });

  const {
    attributes: attributes2,
    listeners: listeners2,
    setNodeRef: setNodeRef2,
    transform: transform2,
    transition: transition2,
    isDragging: isDragging2,
    isOver: isOver2,
  } = useSortable({ id: item.id + "_ghost" });
  // Solo deshabilitar el transform visual cuando se arrastra desde el grid y no es el item activo
  const style = {
    transform: isDraggingFromGrid ? "none" : CSS.Transform.toString(transform),
    transition: isDraggingFromGrid ? "none" : transition,
  };

  if (isOverlay) {
    return (
      <div
        className={`
        h-24 rounded-lg flex items-center justify-center text-white font-medium
        ${item.color} opacity-90 shadow-lg
      `}
      >
        {item.name}
      </div>
    );
  }

  // Si se está arrastrando desde el grid, mostrar placeholder grisado
  if (isDragging && isActiveItem) {
    return (
      <div className="relative">
        {/* Indicador de inserción superior */}
        {isOver && !canCombine && (
          <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
        )}

        <div
          className={`
            h-24 rounded-lg flex items-center justify-center text-gray-500 font-medium
            bg-gray-200 border-2 border-dashed border-gray-300
            ${canCombine ? "ring-4 ring-blue-500 ring-opacity-75" : ""}
          `}
        >
          <div className="text-center">
            <div className="text-sm font-bold">{item.name}</div>
            <div className="text-xs opacity-75">{item.type}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div
        ref={setNodeRef2}
        {...attributes2}
        {...listeners2}
        className="w-[30px] h-24 border border-red-500 flex items-center justify-center text-xs font-bold text-red-500 bg-white"
      >
        aa
      </div>
      <div className="relative flex-1">
        {/* Indicador de inserción superior */}
        {isOver && !canCombine && (
          <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
        )}

        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={`
          h-24 rounded-lg flex items-center justify-center text-white font-medium
          cursor-grab active:cursor-grabbing transition-all
          ${isDragging ? "opacity-50" : "opacity-100"}
          ${canCombine ? "ring-4 ring-blue-500 ring-opacity-75" : ""}
          ${item.color}
        `}
        >
          <div className="text-center">
            <div className="text-sm font-bold">{item.name}</div>
            <div className="text-xs opacity-75">{item.type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para la card vacía al final
function EmptyPlaceholder({ isOver }: { isOver: boolean }) {
  const { setNodeRef } = useDroppable({
    id: "empty-placeholder",
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        h-24 rounded-lg border-2 border-dashed border-gray-300 
        flex items-center justify-center text-gray-500 font-medium
        transition-all duration-200
        ${isOver ? "border-blue-500 bg-blue-50 text-blue-600" : "bg-gray-50"}
      `}
    >
      {isOver ? "Soltar aquí" : "Agregar elemento"}
    </div>
  );
}

// Componente para items del sidebar
function SidebarItemComponent({
  item,
  canCombine = false,
}: {
  item: SidebarItem;
  canCombine?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        h-16 rounded-lg flex items-center justify-center text-white font-medium
        cursor-grab active:cursor-grabbing mb-2 transition-all
        ${isDragging ? "opacity-50" : "opacity-100"}
        ${canCombine ? "ring-4 ring-blue-500 ring-opacity-75" : ""}
        ${item.color}
      `}
    >
      <div className="text-center">
        <div className="text-sm font-bold">{item.name}</div>
        <div className="text-xs opacity-75">{item.type}</div>
      </div>
    </div>
  );
}

// Componente droppable para el grid
function DroppableGrid({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: "grid-container",
  });

  return (
    <div
      ref={setNodeRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 "
    >
      {children}
    </div>
  );
}

export default function DemoPage() {
  const [isClient, setIsClient] = useState(false);
  const [gridItems, setGridItems] = useState<GridItem[]>([
    { id: "1", name: "Item 1", color: "bg-blue-500", type: "type1" },
    { id: "2", name: "Item 2", color: "bg-green-500", type: "type2" },
    { id: "3", name: "Item 3", color: "bg-purple-500", type: "type1" },
    { id: "4", name: "Item 4", color: "bg-red-500", type: "type3" },
    { id: "5", name: "Item 5", color: "bg-yellow-500", type: "type2" },
    { id: "6", name: "Item 6", color: "bg-indigo-500", type: "type3" },
  ]);

  const [sidebarItems] = useState<SidebarItem[]>([
    {
      id: "sidebar-1",
      name: "Nueva Card 1",
      color: "bg-orange-500",
      type: "type1",
    },
    {
      id: "sidebar-2",
      name: "Nueva Card 2",
      color: "bg-pink-500",
      type: "type2",
    },
    {
      id: "sidebar-3",
      name: "Nueva Card 3",
      color: "bg-teal-500",
      type: "type3",
    },
    {
      id: "sidebar-4",
      name: "Nueva Card 4",
      color: "bg-cyan-500",
      type: "type1",
    },
    {
      id: "sidebar-5",
      name: "Nueva Card 5",
      color: "bg-lime-500",
      type: "type2",
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [canCombineWith, setCanCombineWith] = useState<string | null>(null);
  const [isDraggingFromGrid, setIsDraggingFromGrid] = useState<boolean>(false);
  const [isDragBetweenCards, setIsDragBetweenCards] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Determinar si se está arrastrando desde el grid
    const isFromGrid = gridItems.some((item) => item.id === event.active.id);
    setIsDraggingFromGrid(isFromGrid);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    setOverId(over ? (over.id as string) : null);
    console.log("over", over);
    console.log("active", active);
    // Verificar si se puede combinar
    if (active && over) {
      const activeItem =
        gridItems.find((item) => item.id === active.id) ||
        sidebarItems.find((item) => item.id === active.id);
      const overItem =
        gridItems.find((item) => item.id === over.id) ||
        sidebarItems.find((item) => item.id === over.id);

      if (
        activeItem &&
        overItem &&
        activeItem.type === overItem.type &&
        active.id !== over.id
      ) {
        setCanCombineWith(over.id as string);
      } else {
        setCanCombineWith(null);
      }
    } else {
      setCanCombineWith(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setOverId(null);
      setCanCombineWith(null);
      setIsDraggingFromGrid(false);
      return;
    }

    const activeItem =
      gridItems.find((item) => item.id === active.id) ||
      sidebarItems.find((item) => item.id === active.id);
    const overItem =
      gridItems.find((item) => item.id === over.id) ||
      sidebarItems.find((item) => item.id === over.id);

    // Verificar si se puede combinar (mismo tipo)
    if (
      activeItem &&
      overItem &&
      activeItem.type === overItem.type &&
      active.id !== over.id
    ) {
      console.log(`Combinada tarjeta id ${active.id} con id ${over.id}`);

      // Si se arrastra desde sidebar al grid
      if (
        active.id.toString().startsWith("sidebar-") &&
        gridItems.some((item) => item.id === over.id)
      ) {
        const newItem: GridItem = {
          id: `grid-${Date.now()}`,
          name: activeItem.name,
          color: activeItem.color,
          type: activeItem.type,
        };

        setGridItems((items) => {
          const overIndex = items.findIndex((item) => item.id === over.id);
          const newItems = [...items];
          newItems.splice(overIndex + 1, 0, newItem); // Insertar a la derecha
          return newItems;
        });
      }
      // Si se arrastra dentro del grid
      else if (
        !active.id.toString().startsWith("sidebar-") &&
        gridItems.some((item) => item.id === over.id)
      ) {
        setGridItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }
          return items;
        });
      }
      // Si se arrastra desde sidebar al sidebar
      else if (
        active.id.toString().startsWith("sidebar-") &&
        sidebarItems.some((item) => item.id === over.id)
      ) {
        // No hacer nada, solo el console.log
      }
    }
    // Si NO se puede combinar, comportamiento normal de inserción
    else if (active.id.toString().startsWith("sidebar-")) {
      const sidebarItem = sidebarItems.find((item) => item.id === active.id);
      if (!sidebarItem) return;

      const newItem: GridItem = {
        id: `grid-${Date.now()}`,
        name: sidebarItem.name,
        color: sidebarItem.color,
        type: sidebarItem.type,
      };

      // Si se suelta en el placeholder vacío, agregar al final
      if (over.id === "empty-placeholder") {
        setGridItems((items) => [...items, newItem]);
      }
      // Si se suelta sobre un elemento del grid, insertar en esa posición
      else if (gridItems.some((item) => item.id === over.id)) {
        setGridItems((items) => {
          const overIndex = items.findIndex((item) => item.id === over.id);
          const newItems = [...items];
          newItems.splice(overIndex, 0, newItem);
          return newItems;
        });
      }
      // Si se suelta sobre el contenedor del grid, agregar al final
      else if (over.id === "grid-container") {
        setGridItems((items) => [...items, newItem]);
      }
    }
    // Si estamos reordenando dentro del grid (sin combinación)
    else if (
      !active.id.toString().startsWith("sidebar-") &&
      active.id !== over.id
    ) {
      setGridItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }

    setActiveId(null);
    setOverId(null);
    setCanCombineWith(null);
    setIsDraggingFromGrid(false);
  };

  const activeItem =
    gridItems.find((item) => item.id === activeId) ||
    sidebarItems.find((item) => item.id === activeId);

  // Mostrar un loading simple hasta que se hidrate el cliente
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Demo - Drag & Drop Grid
          </h1>
          <p className="text-gray-600 mt-1">
            Arrastra elementos del panel lateral al grid o reorganiza los
            elementos existentes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-8">
            {/* Grid Principal */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Grid Layout
              </h2>
              <SortableContext items={gridItems} strategy={rectSortingStrategy}>
                <DroppableGrid>
                  {gridItems.map((item) => (
                    <GridItemComponent
                      key={item.id}
                      item={item}
                      canCombine={canCombineWith === item.id}
                      isDraggingFromGrid={
                        isDraggingFromGrid && activeId !== item.id
                      }
                      isActiveItem={isDraggingFromGrid && activeId === item.id}
                    />
                  ))}
                  <EmptyPlaceholder isOver={overId === "empty-placeholder"} />
                </DroppableGrid>
              </SortableContext>
            </div>

            {/* Panel Lateral */}
            <div className="w-80">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Elementos Disponibles
              </h2>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Arrastra estos elementos al grid para añadirlos:
                </p>
                <div className="space-y-2">
                  {sidebarItems.map((item) => (
                    <SidebarItemComponent
                      key={item.id}
                      item={item}
                      canCombine={canCombineWith === item.id}
                    />
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Instrucciones:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • <strong>Mismo tipo:</strong> Borde azul = combinación
                  </li>
                  <li>
                    • <strong>Diferente tipo:</strong> Inserción normal
                  </li>
                  <li>
                    • <strong>Combinación:</strong> Se agrega a la derecha
                  </li>
                  <li>
                    • <strong>Reordenar:</strong> Arrastra dentro del grid
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeItem ? (
              <GridItemComponent item={activeItem} isOverlay={true} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
