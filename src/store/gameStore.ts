import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'hexagon';
export type ColorType = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple';

export interface Student {
  id: string;
  name: string;
  shape: ShapeType;
  color: ColorType;
}

export interface Class {
  grade: number; // 1-4
  section: string; // A-G
  students: Student[];
  createdAt: number;
}

export interface Teacher {
  id: string;
  name: string;
  photoURL?: string;
  classes: Class[];
}

export type GamePhase = 
  | 'splash'
  | 'login'
  | 'welcome'
  | 'class-select'
  | 'class-create'
  | 'student-setup'
  | 'player-select'
  | 'memorize'
  | 'countdown'
  | 'collect'
  | 'reconstruct'
  | 'results';

export type Difficulty = 'Easy' | 'Hard';

export interface CollectedShape {
  id: string;
  shape: ShapeType;
  color: ColorType;
  collectedAt: number;
  assignedToPlayerId: string;
}

export interface PlacedShape {
  id: string;
  shape: ShapeType;
  color: ColorType;
  targetX: number;
  targetY: number;
  placedX: number;
  placedY: number;
  isAccurate: boolean;
  placedByPlayerId: string;
}

export interface ReferenceTarget {
  id: string;
  shape: ShapeType;
  color: ColorType;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

interface GameState {
  // Phase & Core navigation
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;

  // Persistent User data
  teacher: Teacher | null;
  selectedClass: { grade: number; section: string } | null;
  loginTeacher: (email: string, password?: string) => boolean;
  loginWithGoogle: (name: string, email: string, photoURL?: string) => void;
  logoutTeacher: () => void;
  createClass: (grade: number, section: string) => void;
  selectClass: (grade: number, section: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => boolean;
  updateStudent: (id: string, updates: Partial<Student>) => boolean;
  removeStudent: (id: string) => void;

  // Active Session settings
  selectedPlayerIds: string[]; // exactly 3 players
  difficulty: Difficulty;
  activePlayerIndex: number; // 0, 1, or 2 for separate turns
  referenceTargets: ReferenceTarget[];
  collectedShapes: CollectedShape[]; // combined collected shapes by all players
  missedCount: number;
  misses: number;
  playerScores: Record<string, number>; // studentId -> score
  score: number;
  placements: PlacedShape[];

  // Session Actions
  setupGame: (playerIds: string[], difficulty: Difficulty) => void;
  startCollectPhase: () => void;
  nextPlayerTurn: () => void;
  collectShape: (shape: { shape: ShapeType; color: ColorType }) => void;
  recordMiss: () => void;
  placeShape: (placement: Omit<PlacedShape, 'id'>) => void;
  resetSession: () => void;
  initializeStore: () => void;
  updateScore: (points: number, playerId?: string) => void;
  updateTeacherName: (name: string) => void;
  finishGameSession: () => void;
  resetGameSession: () => void;
}

// Helper to generate reference target placements for the Memorize/Reconstruct phase
const generateReferenceTargets = (students: Student[], playerIds: string[]): ReferenceTarget[] => {
  const selectedStudents = students.filter(s => playerIds.includes(s.id));
  
  const SHAPE_ROWS: Record<string, number> = {
    square: 25,
    triangle: 35,
    circle: 45,
    hexagon: 55,
    rectangle: 65,
    star: 75
  };

  const COLOR_COLS: Record<string, number> = {
    red: 25,
    orange: 35,
    yellow: 45,
    green: 55,
    blue: 65,
    purple: 75
  };

  return selectedStudents.map((student, idx) => ({
    id: `ref-${student.id}-${idx}`,
    shape: student.shape,
    color: student.color,
    x: COLOR_COLS[student.color] || 50,
    y: SHAPE_ROWS[student.shape] || 50,
  }));
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'splash',
      setPhase: (phase) => set({ phase }),

      teacher: null,
      selectedClass: null,
      selectedPlayerIds: [],
      difficulty: 'Easy',
      activePlayerIndex: 0,
      referenceTargets: [],
      collectedShapes: [],
      missedCount: 0,
      misses: 0,
      playerScores: {},
      score: 0,
      placements: [],

      loginTeacher: (email, password) => {
        if (email === 'pranayaTest@gmail.com' && password === 'test-password') {
          const initialClasses: Class[] = [
            {
              grade: 1,
              section: 'C',
              createdAt: Date.now() - 86400000,
              students: [
                { id: 's1', name: 'Tushar', shape: 'square', color: 'orange' },
                { id: 's2', name: 'Aarohi', shape: 'circle', color: 'green' },
                { id: 's3', name: 'Adhya', shape: 'triangle', color: 'blue' },
                { id: 's4', name: 'Shrikar', shape: 'rectangle', color: 'purple' },
                { id: 's5', name: 'Rohan', shape: 'star', color: 'yellow' },
                { id: 's6', name: 'Mira', shape: 'hexagon', color: 'red' },
              ],
            },
            {
              grade: 2,
              section: 'A',
              createdAt: Date.now() - 43200000,
              students: [
                { id: 's21', name: 'Kabir', shape: 'circle', color: 'red' },
                { id: 's22', name: 'Ishani', shape: 'star', color: 'blue' },
                { id: 's23', name: 'Vihaan', shape: 'hexagon', color: 'green' },
                { id: 's24', name: 'Ananya', shape: 'square', color: 'yellow' },
              ],
            },
            {
              grade: 3,
              section: 'B',
              createdAt: Date.now() - 21600000,
              students: [
                { id: 's31', name: 'Arjun', shape: 'triangle', color: 'purple' },
                { id: 's32', name: 'Saanvi', shape: 'rectangle', color: 'orange' },
              ],
            },
          ];
          set({
            teacher: {
              id: 't-premium',
              name: 'Pranaya Miss',
              classes: initialClasses,
            },
            phase: 'welcome',
          });
          return true;
        }
        
        if (email && !password) {
          set({
            teacher: {
              id: 't-guest',
              name: email,
              classes: [],
            },
            phase: 'welcome',
          });
          return true;
        }

        if (email && password) {
          const starterClass: Class = {
            grade: 1,
            section: 'A',
            createdAt: Date.now(),
            students: [
              { id: `t-s1-${Date.now()}`, name: 'Sample Student 1', shape: 'circle', color: 'red' },
              { id: `t-s2-${Date.now()}`, name: 'Sample Student 2', shape: 'star', color: 'yellow' },
            ],
          };
          set({
            teacher: {
              id: `t-email-${email}`,
              name: email.split('@')[0],
              classes: [starterClass],
            },
            phase: 'welcome',
          });
          return true;
        }

        return false;
      },

      loginWithGoogle: (name, email, photoURL) => {
        // Give new Google users a starter class so the app isn't empty
        const starterClass: Class = {
          grade: 1,
          section: 'A',
          createdAt: Date.now(),
          students: [
            { id: `g-s1-${Date.now()}`, name: 'Sample Student 1', shape: 'circle', color: 'red' },
            { id: `g-s2-${Date.now()}`, name: 'Sample Student 2', shape: 'star', color: 'yellow' },
          ],
        };

        set({
          teacher: {
            id: `t-google-${email}`,
            name: name,
            photoURL: photoURL || undefined,
            classes: [starterClass],
          },
          phase: 'welcome',
        });
      },

      logoutTeacher: () => {
        set({ teacher: null, selectedClass: null, phase: 'splash' });
      },

      createClass: (grade, section) => {
        const { teacher } = get();
        if (!teacher) return;
        
        // check if exists
        const exists = teacher.classes.some(c => c.grade === grade && c.section === section);
        if (exists) {
          get().selectClass(grade, section);
          return;
        }

        const newClass: Class = {
          grade,
          section,
          students: [],
          createdAt: Date.now(),
        };

        set({
          teacher: {
            ...teacher,
            classes: [...teacher.classes, newClass],
          },
          selectedClass: { grade, section },
          phase: 'student-setup',
        });
      },

      selectClass: (grade, section) => {
        set({
          selectedClass: { grade, section },
          phase: 'student-setup',
        });
      },

      addStudent: (studentData) => {
        const { teacher, selectedClass } = get();
        if (!teacher || !selectedClass) return false;

        const clsIndex = teacher.classes.findIndex(
          c => c.grade == selectedClass.grade && c.section == selectedClass.section
        );
        if (clsIndex === -1) return false;

        const currentClass = teacher.classes[clsIndex];
        if (currentClass.students.length >= 8) return false; // Maximum 8 students

        // Validate unique shape-color combination
        const isDuplicateCombo = currentClass.students.some(
          s => s.shape === studentData.shape && s.color === studentData.color
        );
        if (isDuplicateCombo) return false;

        const newStudent: Student = {
          ...studentData,
          id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        };

        const updatedClasses = [...teacher.classes];
        updatedClasses[clsIndex] = {
          ...currentClass,
          students: [...currentClass.students, newStudent],
        };

        set({
          teacher: {
            ...teacher,
            classes: updatedClasses,
          },
        });
        return true;
      },

      updateStudent: (id, updates) => {
        const { teacher, selectedClass } = get();
        if (!teacher || !selectedClass) return false;

        const clsIndex = teacher.classes.findIndex(
          c => c.grade == selectedClass.grade && c.section == selectedClass.section
        );
        if (clsIndex === -1) return false;

        const currentClass = teacher.classes[clsIndex];
        
        // If updating shape/color, validate uniqueness among other students
        const targetStudent = currentClass.students.find(s => s.id === id);
        if (!targetStudent) return false;

        const nextShape = updates.shape || targetStudent.shape;
        const nextColor = updates.color || targetStudent.color;

        const isDuplicateCombo = currentClass.students.some(
          s => s.id !== id && s.shape === nextShape && s.color === nextColor
        );
        if (isDuplicateCombo) return false;

        const updatedStudents = currentClass.students.map(s => 
          s.id === id ? { ...s, ...updates } : s
        );

        const updatedClasses = [...teacher.classes];
        updatedClasses[clsIndex] = {
          ...currentClass,
          students: updatedStudents,
        };

        set({
          teacher: { ...teacher, classes: updatedClasses },
        });
        return true;
      },

      removeStudent: (id) => {
        const { teacher, selectedClass } = get();
        if (!teacher || !selectedClass) return;

        const clsIndex = teacher.classes.findIndex(
          c => c.grade == selectedClass.grade && c.section == selectedClass.section
        );
        if (clsIndex === -1) return;

        const currentClass = teacher.classes[clsIndex];
        const updatedClasses = [...teacher.classes];
        updatedClasses[clsIndex] = {
          ...currentClass,
          students: currentClass.students.filter(s => s.id !== id),
        };

        set({
          teacher: { ...teacher, classes: updatedClasses },
        });
      },


      setupGame: (playerIds, difficulty) => {
        const { teacher, selectedClass } = get();
        if (!teacher || !selectedClass) return;

        const currentClass = teacher.classes.find(
          c => c.grade == selectedClass.grade && c.section == selectedClass.section
        );
        if (!currentClass) return;

        const targets = generateReferenceTargets(currentClass.students, playerIds);

        const initialScores: Record<string, number> = {};
        playerIds.forEach(id => initialScores[id] = 0);

        set({
          selectedPlayerIds: playerIds,
          difficulty,
          activePlayerIndex: 0,
          referenceTargets: targets,
          collectedShapes: [],
          missedCount: 0,
          misses: 0,
          score: 0,
          playerScores: initialScores,
          placements: [],
          phase: 'memorize',
        });
      },

      startCollectPhase: () => {
        set({ phase: 'collect' });
      },

      nextPlayerTurn: () => {
        const { activePlayerIndex, selectedPlayerIds } = get();
        if (activePlayerIndex < selectedPlayerIds.length - 1) {
          // Proceed to next player's countdown/collect turn
          set({ 
            activePlayerIndex: activePlayerIndex + 1,
            phase: 'countdown',
          });
        } else {
          // All selected players completed collection turns, transition to reconstruction phase
          set({ phase: 'reconstruct' });
        }
      },

      collectShape: ({ shape, color }) => {
        const { selectedPlayerIds, activePlayerIndex, collectedShapes } = get();
        const activePlayerId = selectedPlayerIds[activePlayerIndex];
        if (!activePlayerId) return;

        const newCollection: CollectedShape = {
          id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          shape,
          color,
          collectedAt: Date.now(),
          assignedToPlayerId: activePlayerId,
        };

        const currentScores = { ...get().playerScores };
        if (currentScores[activePlayerId] !== undefined) {
          currentScores[activePlayerId] += 10;
        }

        set({
          collectedShapes: [...collectedShapes, newCollection],
          score: get().score + 10,
          playerScores: currentScores,
        });
      },

      recordMiss: () => {
        set({ missedCount: get().missedCount + 1, misses: get().misses + 1 });
      },

      placeShape: (placementData) => {
        const newPlacement: PlacedShape = {
          ...placementData,
          id: `plc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        };

        const updatedPlacements = [...get().placements, newPlacement];
        let extraScore = 0;
        if (placementData.isAccurate) {
          extraScore = 100; // heavy reward for accurate image placement reconstruction
        }

        set({
          placements: updatedPlacements,
          score: get().score + extraScore,
        });
      },

      resetSession: () => {
        set({
          selectedPlayerIds: [],
          activePlayerIndex: 0,
          referenceTargets: [],
          collectedShapes: [],
          missedCount: 0,
          misses: 0,
          score: 0,
          placements: [],
          phase: 'player-select',
        });
      },

      initializeStore: () => {
        // Hydration helper for Next.js mounting phase lifecycle
      },

      updateScore: (points, playerId) => {
        const total = get().score + points;
        const pScores = { ...get().playerScores };
        if (playerId && pScores[playerId] !== undefined) {
          pScores[playerId] += points;
        } else {
          // If no specific player (legacy or shared), credit active player
          const { selectedPlayerIds, activePlayerIndex } = get();
          const activeId = selectedPlayerIds[activePlayerIndex];
          if (activeId && pScores[activeId] !== undefined) {
            pScores[activeId] += points;
          }
        }
        set({ score: total, playerScores: pScores });
      },

      updateTeacherName: (name) => {
        const { teacher } = get();
        if (teacher) {
          set({
            teacher: { ...teacher, name }
          });
        }
      },

      finishGameSession: () => {
        set({ phase: 'results' });
      },

      resetGameSession: () => {
        get().resetSession();
      },
    }),
    {
      name: 'shapy-game-storage',
      partialize: (state) => ({
        teacher: state.teacher,
        selectedClass: state.selectedClass,
      }), // Persist teacher and class records across reloads
    }
  )
);
