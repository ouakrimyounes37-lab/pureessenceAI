
import React, { useState } from 'react';
import { TrainingCourse } from '../../../types';
import { PlayCircle, MessageSquare, Send, Bot, Plus, FileText, Video, Lock } from 'lucide-react';
import CreateCourseModal from './CreateCourseModal';

interface TrainingModuleProps {
  courses: TrainingCourse[];
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onAddCourse: (course: Partial<TrainingCourse>) => void;
  isReadOnly?: boolean;
}

const TrainingModule: React.FC<TrainingModuleProps> = ({ courses, notify, onAddCourse, isReadOnly = false }) => {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
      {role: 'bot', text: 'Bonjour ! Je suis l\'assistant Qualité IA. Posez-moi une question sur les procédures ISO ou les BPF.'}
  ]);
  const [input, setInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSend = () => {
      if(!input.trim()) return;
      setMessages([...messages, {role: 'user', text: input}]);
      setInput('');
      setTimeout(() => {
          setMessages(prev => [...prev, {role: 'bot', text: 'Ceci est une réponse simulée. Dans l\'application réelle, je serais connecté à l\'API Gemini pour répondre intelligemment à vos questions sur la qualité.'}]);
      }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-in fade-in duration-500">
       {/* Courses Section */}
       <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Formation & Compétences</h2>
                    <p className="text-slate-500">Modules e-learning et suivi RH</p>
                </div>
                {!isReadOnly ? (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} /> Créer Cours
                    </button>
                ) : (
                    <div className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
                        <Lock size={12} /> Lecture Seule
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-100 rounded-lg text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                                {course.content && course.content[0]?.type === 'Video' ? <Video size={24} /> : <FileText size={24} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{course.title}</h3>
                                <p className="text-sm text-slate-500">Assigné à : {course.assignedTo} • Échéance : {course.dueDate}</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${course.completionRate}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{course.completionRate}%</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => notify(`Lancement du module : ${course.title}`, 'info')}
                            className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                            <PlayCircle size={24} />
                        </button>
                    </div>
                ))}
            </div>
       </div>

       {/* Chatbot Section */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Bot size={20} className="text-emerald-600" />
                <span className="font-bold text-slate-700">Assistant Qualité IA</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                            m.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Posez une question..." 
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button onClick={handleSend} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                        <Send size={18} />
                    </button>
                </div>
            </div>
       </div>

       {isModalOpen && (
           <CreateCourseModal onClose={() => setIsModalOpen(false)} onSubmit={onAddCourse} />
       )}
    </div>
  );
};

export default TrainingModule;
