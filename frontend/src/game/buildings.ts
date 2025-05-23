import { Building } from './SimpleGameEngine';
import apartmentSprite from '../img/sprites/apartment.png';
import hospitalSprite from '../img/sprites/hospital.png';
import camphouseSprite from '../img/sprites/camphouse.png';
import autoserviceSprite from '../img/sprites/autoservice.png';

// Конфигурация всех зданий в игре
export const BUILDINGS: Building[] = [
  {
    id: 'apartment',
    name: 'Жилой дом',
    sprite: apartmentSprite,
    description: 'Комфортное место для проживания жителей города'
  },
  {
    id: 'hospital',
    name: 'Больница',
    sprite: hospitalSprite,
    description: 'Медицинский центр для лечения и профилактики'
  },
  {
    id: 'camphouse',
    name: 'Лагерь',
    sprite: camphouseSprite,
    description: 'Место отдыха и развлечений на природе'
  },
  {
    id: 'autoservice',
    name: 'Автосервис',
    sprite: autoserviceSprite,
    description: 'Ремонт и обслуживание автомобилей'
  },
];

// Получить здание по ID
export function getBuildingById(id: string): Building | undefined {
  return BUILDINGS.find(building => building.id === id);
}

// Получить случайное здание
export function getRandomBuilding(): Building {
  const randomIndex = Math.floor(Math.random() * BUILDINGS.length);
  return BUILDINGS[randomIndex];
} 