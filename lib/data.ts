export type Exercise = {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  calories?: number;
  image: string;
  section: 'warmup' | 'main';
};

export type Workout = {
  id: string;
  name: string;
  duration: number; // minutes
  calories: number;
  exercises: Exercise[];
  dayLabel: string;
};

export type Meal = {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: string[];
  done: boolean;
};

export type Goal = {
  currentWeight: number;
  goalWeight: number;
  startWeight: number;
  weeklyWorkouts: number;
  goalWeeklyWorkouts: number;
  dailyCalories: number;
  goalDailyCalories: number;
  weeklyStreak: number;
};

// Workout images from Unsplash (fitness/gym)
const GYM_IMAGES = {
  cardio: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  stretching: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  benchPress: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  tricepsPulley: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
  inclineFly: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
  dips: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&q=80',
  squat: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
  legPress: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  deadlift: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80',
  pulldown: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80',
  shoulderPress: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400&q=80',
  bicepCurl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&q=80',
};

export const WORKOUTS: Workout[] = [
  {
    id: 'chest-triceps',
    name: 'Peito + Tríceps',
    duration: 45,
    calories: 320,
    dayLabel: 'SEG',
    exercises: [
      { id: 'e1', name: 'Cardio Leve', duration: '5 min', calories: 100, image: GYM_IMAGES.cardio, section: 'warmup' },
      { id: 'e2', name: 'Alongamento', sets: 3, image: GYM_IMAGES.stretching, section: 'warmup' },
      { id: 'e3', name: 'Supino Reto', sets: 4, reps: '8-10 reps', image: GYM_IMAGES.benchPress, section: 'main' },
      { id: 'e4', name: 'Tríceps Pulley', sets: 3, reps: '12 reps', image: GYM_IMAGES.tricepsPulley, section: 'main' },
      { id: 'e5', name: 'Crucifixo Inclinado', sets: 3, reps: '10 reps', image: GYM_IMAGES.inclineFly, section: 'main' },
      { id: 'e6', name: 'Mergulho nas Paralelas', sets: 3, reps: '12 reps', image: GYM_IMAGES.dips, section: 'main' },
    ],
  },
  {
    id: 'legs',
    name: 'Pernas',
    duration: 60,
    calories: 450,
    dayLabel: 'TER',
    exercises: [
      { id: 'e7', name: 'Cardio Leve', duration: '5 min', calories: 80, image: GYM_IMAGES.cardio, section: 'warmup' },
      { id: 'e8', name: 'Alongamento', sets: 3, image: GYM_IMAGES.stretching, section: 'warmup' },
      { id: 'e9', name: 'Agachamento Livre', sets: 4, reps: '10-12 reps', image: GYM_IMAGES.squat, section: 'main' },
      { id: 'e10', name: 'Leg Press', sets: 3, reps: '12 reps', image: GYM_IMAGES.legPress, section: 'main' },
      { id: 'e11', name: 'Stiff', sets: 3, reps: '10 reps', image: GYM_IMAGES.deadlift, section: 'main' },
    ],
  },
  {
    id: 'back-biceps',
    name: 'Costas + Bíceps',
    duration: 50,
    calories: 380,
    dayLabel: 'QUA',
    exercises: [
      { id: 'e12', name: 'Cardio Leve', duration: '5 min', calories: 90, image: GYM_IMAGES.cardio, section: 'warmup' },
      { id: 'e13', name: 'Alongamento', sets: 2, image: GYM_IMAGES.stretching, section: 'warmup' },
      { id: 'e14', name: 'Puxada Frontal', sets: 4, reps: '10 reps', image: GYM_IMAGES.pulldown, section: 'main' },
      { id: 'e15', name: 'Rosca Direta', sets: 3, reps: '12 reps', image: GYM_IMAGES.bicepCurl, section: 'main' },
    ],
  },
  {
    id: 'shoulders',
    name: 'Ombros',
    duration: 40,
    calories: 280,
    dayLabel: 'QUI',
    exercises: [
      { id: 'e16', name: 'Cardio Leve', duration: '5 min', calories: 70, image: GYM_IMAGES.cardio, section: 'warmup' },
      { id: 'e17', name: 'Desenvolvimento', sets: 4, reps: '10 reps', image: GYM_IMAGES.shoulderPress, section: 'main' },
    ],
  },
];

export const WEEK_DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

export const MEALS: Meal[] = [
  {
    id: 'm1',
    name: 'Café da Manhã',
    time: '07:00',
    calories: 420,
    protein: 30,
    carbs: 45,
    fat: 12,
    items: ['3 ovos mexidos', 'Pão integral', 'Banana', 'Café preto'],
    done: true,
  },
  {
    id: 'm2',
    name: 'Lanche da Manhã',
    time: '10:00',
    calories: 180,
    protein: 15,
    carbs: 20,
    fat: 4,
    items: ['Iogurte grego', 'Granola', 'Morango'],
    done: true,
  },
  {
    id: 'm3',
    name: 'Almoço',
    time: '13:00',
    calories: 650,
    protein: 50,
    carbs: 70,
    fat: 15,
    items: ['Frango grelhado 200g', 'Arroz integral', 'Feijão', 'Salada verde'],
    done: false,
  },
  {
    id: 'm4',
    name: 'Pré-Treino',
    time: '16:00',
    calories: 220,
    protein: 20,
    carbs: 30,
    fat: 3,
    items: ['Batata doce', 'Frango 100g'],
    done: false,
  },
  {
    id: 'm5',
    name: 'Pós-Treino',
    time: '19:00',
    calories: 350,
    protein: 40,
    carbs: 35,
    fat: 5,
    items: ['Whey protein', 'Banana', 'Aveia'],
    done: false,
  },
  {
    id: 'm6',
    name: 'Jantar',
    time: '21:00',
    calories: 480,
    protein: 40,
    carbs: 40,
    fat: 12,
    items: ['Salmão grelhado', 'Batata doce', 'Brócolis'],
    done: false,
  },
];

export const DEFAULT_GOAL: Goal = {
  currentWeight: 82,
  goalWeight: 75,
  startWeight: 88,
  weeklyWorkouts: 5,
  goalWeeklyWorkouts: 5,
  dailyCalories: 2300,
  goalDailyCalories: 2500,
  weeklyStreak: 3,
};

export const PROGRESS_DATA = {
  weightHistory: [88, 87, 86.5, 85, 84, 83.2, 82],
  workoutsPerWeek: [3, 4, 3, 5, 4, 5, 5],
  caloriesPerWeek: [1800, 2100, 2000, 2300, 2200, 2400, 2300],
  labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7'],
};

export type Professional = {
  id: string;
  name: string;
  type: 'personal' | 'nutritionist';
  specialty: string;
  rating: number;
  reviews: number;
  available: boolean;
  bio: string;
  experience: string;
  avatar: string;
  specialties: string[];
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'professional';
  timestamp: Date;
};

export const PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Carlos Mendes',
    type: 'personal',
    specialty: 'Hipertrofia & Força',
    rating: 4.9,
    reviews: 128,
    available: true,
    bio: 'Personal trainer com 8 anos de experiência, especializado em hipertrofia muscular e treino funcional. Formado em Educação Física pela USP.',
    experience: '8 anos',
    avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80',
    specialties: ['Hipertrofia', 'Força', 'Funcional', 'Emagrecimento'],
  },
  {
    id: 'p2',
    name: 'Rafael Costa',
    type: 'personal',
    specialty: 'Emagrecimento & Condicionamento',
    rating: 4.7,
    reviews: 95,
    available: true,
    bio: 'Especialista em emagrecimento e condicionamento físico. Atua com atletas amadores e iniciantes que buscam transformação corporal.',
    experience: '5 anos',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80',
    specialties: ['Emagrecimento', 'Cardio', 'HIIT', 'Resistência'],
  },
  {
    id: 'p3',
    name: 'Fernanda Lima',
    type: 'personal',
    specialty: 'Pilates & Mobilidade',
    rating: 4.8,
    reviews: 74,
    available: false,
    bio: 'Personal trainer e instrutora de pilates. Foco em mobilidade, postura e qualidade de movimento para todos os públicos.',
    experience: '6 anos',
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&q=80',
    specialties: ['Pilates', 'Mobilidade', 'Postura', 'Reabilitação'],
  },
  {
    id: 'n1',
    name: 'Dra. Ana Paula',
    type: 'nutritionist',
    specialty: 'Nutrição Esportiva',
    rating: 4.9,
    reviews: 156,
    available: true,
    bio: 'Nutricionista esportiva com foco em performance e composição corporal. Atende atletas amadores e profissionais com planos alimentares personalizados.',
    experience: '10 anos',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
    specialties: ['Nutrição Esportiva', 'Hipertrofia', 'Emagrecimento', 'Suplementação'],
  },
  {
    id: 'n2',
    name: 'Dr. Marcos Silva',
    type: 'nutritionist',
    specialty: 'Nutrição Funcional',
    rating: 4.6,
    reviews: 88,
    available: true,
    bio: 'Especialista em nutrição funcional e comportamental. Ajuda pacientes a desenvolverem uma relação saudável com a alimentação.',
    experience: '7 anos',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
    specialties: ['Nutrição Funcional', 'Comportamento Alimentar', 'Saúde Intestinal'],
  },
  {
    id: 'n3',
    name: 'Dra. Juliana Rocha',
    type: 'nutritionist',
    specialty: 'Dietas Plant-Based',
    rating: 4.8,
    reviews: 62,
    available: false,
    bio: 'Nutricionista especializada em dietas plant-based e vegetarianas para atletas. Consultora de nutrição para academias e clubes esportivos.',
    experience: '4 anos',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80',
    specialties: ['Plant-Based', 'Vegetarianismo', 'Veganismo', 'Sustentabilidade'],
  },
];

export const AUTO_REPLIES: Record<string, string[]> = {
  treino: [
    'Ótima pergunta! Para o seu objetivo, recomendo começar com 3 treinos por semana.',
    'Vou montar um plano personalizado para você. Pode me contar mais sobre sua rotina?',
  ],
  dieta: [
    'A alimentação é fundamental para os resultados. Vou analisar seu perfil e sugerir um plano.',
    'Para ganhar massa, precisamos garantir um superávit calórico com proteínas adequadas.',
  ],
  dor: [
    'Dores musculares são normais no início. Se persistir, recomendo consultar um médico.',
    'Vamos ajustar a intensidade do treino para evitar lesões. Descanso também é treino!',
  ],
  default: [
    'Olá! Recebi sua mensagem e vou te responder em breve. 💪',
    'Boa pergunta! Deixa eu verificar as melhores opções para o seu caso.',
    'Pode contar comigo! Estou aqui para te ajudar a alcançar seus objetivos.',
    'Entendido! Vou preparar uma resposta personalizada para você.',
  ],
};

export const STATS = {
  caloriesToday: 520,
  minutesToday: 48,
  workoutsThisWeek: 5,
  totalWorkouts: 7,
  betterThanPercent: 82,
  weeklyImprovement: 12,
};
