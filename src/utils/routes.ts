import { 
  Menu, 
  FileText, 
  Users, 
  GraduationCap, 
  BarChart3,
  FolderOpen,
  BookOpen
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface RouteLink {
  title: string;
  path: string;
  icon: LucideIcon;
}

export interface RouteGroup {
  title: string;
  icon: LucideIcon;
  children: RouteLink[];
}

export type RouteItem = RouteLink | RouteGroup;

export interface RouteSection {
  separator: string;
  items: RouteItem[];
}

export const isRouteGroup = (item: RouteItem): item is RouteGroup => {
  return 'children' in item;
};

export const isRouteLink = (item: RouteItem): item is RouteLink => {
  return 'path' in item;
};

export const ROUTES: RouteSection[] = [
  {
    separator: "Tesis",
    items: [
      {
        title: "Gestión de Tesis",
        icon: FolderOpen,
        children: [
          {
            title: "Todas las Tesis",
            path: "",
            icon: FileText,
          },
          {
            title: "Nueva Tesis",
            path: "new-thesis",
            icon: BookOpen,
          },
          {
            title: "En Revisión",
            path: "thesis-review",
            icon: FileText,
          },
        ],
      },
      {
        title: "Docentes",
        path: "form-teachers",
        icon: Users,
      },
    ],
  },
  {
    separator: "Reportes",
    items: [
      {
        title: "Estudiantes",
        path: "form-students",
        icon: GraduationCap,
      },
      {
        title: "Estadísticas",
        icon: BarChart3,
        children: [
          {
            title: "General",
            path: "stats-general",
            icon: BarChart3,
          },
          {
            title: "Por Facultad",
            path: "stats-faculty",
            icon: BarChart3,
          },
        ],
      },
    ],
  },
];