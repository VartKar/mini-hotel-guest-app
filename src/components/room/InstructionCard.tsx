import { LucideIcon } from "lucide-react";

interface InstructionCardProps {
  icon: LucideIcon | string;
  title: string;
  content: string;
}

const InstructionCard = ({ icon: Icon, title, content }: InstructionCardProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center mb-2">
        {typeof Icon === 'string' ? (
          <div className="w-8 h-8 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark mr-3">
            {Icon}
          </div>
        ) : (
          <Icon className="w-5 h-5 text-hotel-accent mr-3 ml-1" />
        )}
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-sm text-hotel-neutral ml-11">{content}</p>
    </div>
  );
};

export default InstructionCard;
