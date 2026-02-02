import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  GripVertical, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Folder,
  Award,
  Trophy,
  Wrench,
  Settings2,
  X
} from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import type { ResumeSection } from '@/types/resume';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const sectionIcons: Record<string, React.ReactNode> = {
  personalInfo: <User className="h-4 w-4" />,
  summary: <FileText className="h-4 w-4" />,
  skills: <Wrench className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  projects: <Folder className="h-4 w-4" />,
  certifications: <Award className="h-4 w-4" />,
  achievements: <Trophy className="h-4 w-4" />,
};

const sectionLabels: Record<string, string> = {
  personalInfo: 'Personal Info',
  summary: 'Professional Summary',
  skills: 'Skills',
  experience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
};

interface SortableSectionItemProps {
  section: ResumeSection;
  onToggle: (id: string) => void;
}

function SortableSectionItem({ section, onToggle }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isPersonalInfo = section.type === 'personalInfo';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-card border border-border rounded-lg transition-all",
        isDragging && "shadow-elevated z-10 opacity-90",
        !section.enabled && "opacity-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "cursor-grab touch-none p-1 rounded hover:bg-muted transition-colors",
          isPersonalInfo && "cursor-not-allowed opacity-50"
        )}
        disabled={isPersonalInfo}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      
      <div className="flex items-center gap-2 flex-1">
        <span className="text-muted-foreground">
          {sectionIcons[section.type]}
        </span>
        <span className="font-medium text-sm">
          {sectionLabels[section.type]}
        </span>
      </div>

      <Switch
        checked={section.enabled}
        onCheckedChange={() => onToggle(section.id)}
        disabled={isPersonalInfo}
        className="data-[state=checked]:bg-accent"
      />
    </div>
  );
}

interface SectionManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SectionManager({ open, onOpenChange }: SectionManagerProps) {
  const { currentResume, updateSections, toggleSection } = useResumeStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentResume) return null;

  const sortedSections = [...currentResume.sections].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);

      // Don't allow moving personalInfo from first position
      if (sortedSections[oldIndex].type === 'personalInfo' || newIndex === 0) {
        return;
      }

      const newSections = arrayMove(sortedSections, oldIndex, newIndex).map(
        (section, index) => ({
          ...section,
          order: index,
        })
      );

      updateSections(newSections);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Manage Sections
          </DialogTitle>
          <DialogDescription>
            Drag to reorder sections. Toggle visibility for each section.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedSections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  onToggle={toggleSection}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
