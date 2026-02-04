
import React, { useState, useRef } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, HelpCircle as QuestionIcon, Check, X } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

type ModalType = 'id-empty' | 'id-format' | 'id-exists' | 'id-available' | 'id-not-checked' | 'confirm' | 'success';

export default function Login({ onLogin }: LoginProps) {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [modal, setModal] = useState<{ type: ModalType, isOpen: boolean } | null>(null);
  
  // Registration States
  const [formData, setFormData] = useState({
    id: '',
    pw: '',
    pwConfirm: '',
    name: '',
    affiliation: '',
    email: '',
    phone: '',
    systems: [] as string[]
  });

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isIdChecked, setIsIdChecked] = useState(false);

  // Input Refs for auto-focus on error
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pwConfirmRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const affiliationRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePw = (pw: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pw);
  const validateId = (id: string) => /^[A-Za-z0-9]{5,20}$/.test(id);

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setFormData({ ...formData, phone: formatted });
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleIdCheck = () => {
    if (!formData.id) {
      setErrors(prev => ({ ...prev, id: '아이디를 입력해 주세요.' }));
      idRef.current?.focus();
      return;
    }
    if (!validateId(formData.id)) {
      setModal({ type: 'id-format', isOpen: true });
      return;
    }
    
    if (formData.id === 'admin') {
      setModal({ type: 'id-exists', isOpen: true });
      setIsIdChecked(false);
    } else {
      setModal({ type: 'id-available', isOpen: true });
      setIsIdChecked(true);
      setErrors(prev => ({ ...prev, id: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id) newErrors.id = '아이디를 입력해 주세요.';
    if (!formData.pw) newErrors.pw = '비밀번호를 입력해 주세요.';
    else if (!validatePw(formData.pw)) newErrors.pw = '영문 대소문자, 숫자, 특수문자를 혼용하여 8자 이상 입력해 주세요.';
    if (!formData.pwConfirm) newErrors.pwConfirm = '비밀번호를 한 번 더 입력해 주세요.';
    else if (formData.pw !== formData.pwConfirm) newErrors.pwConfirm = '비밀번호를 확인해 주세요.';
    if (!formData.name) newErrors.name = '이름을 입력해 주세요.';
    if (!formData.affiliation) newErrors.affiliation = '소속을 입력해 주세요.';
    if (!formData.email) newErrors.email = '이메일을 입력해 주세요.';
    else if (!validateEmail(formData.email)) newErrors.email = '올바른 이메일 형식으로 입력해 주세요.';
    if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력해 주세요.';
    else if (formData.phone.length < 12) newErrors.phone = '올바른 휴대폰 번호 형식으로 입력해 주세요.';
    if (formData.systems.length === 0) newErrors.systems = '이용 희망 시스템을 1개 이상 선택해 주세요.';

    setErrors(newErrors);

    if (newErrors.id) { idRef.current?.focus(); return; }
    if (newErrors.pw) { pwRef.current?.focus(); return; }
    if (newErrors.pwConfirm) { pwConfirmRef.current?.focus(); return; }
    if (newErrors.name) { nameRef.current?.focus(); return; }
    if (newErrors.affiliation) { affiliationRef.current?.focus(); return; }
    if (newErrors.email) { emailRef.current?.focus(); return; }
    if (newErrors.phone) { phoneRef.current?.focus(); return; }

    if (Object.keys(newErrors).length > 0) return;
    if (!isIdChecked) {
      setModal({ type: 'id-not-checked', isOpen: true });
      return;
    }
    setModal({ type: 'confirm', isOpen: true });
  };

  const toggleSystem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      systems: prev.systems.includes(id) 
        ? prev.systems.filter(s => s !== id) 
        : [...prev.systems, id]
    }));
    if (errors.systems) setErrors(prev => ({ ...prev, systems: '' }));
  };

  const Modal = ({ type }: { type: ModalType }) => {
    const commonStyles = "bg-slate-900/95 backdrop-blur-3xl border border-white/10 p-10 max-w-sm w-full text-center shadow-[0_20px_60px_rgba(0,0,0,1)] z-[300] animate-in zoom-in-95 duration-200";
    
    const getContent = () => {
      switch (type) {
        case 'id-format': return { icon: <AlertTriangle size={64} className="mx-auto text-yellow-500/80 mb-6" />, title: '아이디 형식 확인', desc: '아이디는 영문과 숫자 조합으로 5~20자리를 사용해야 합니다.', btnText: '확인', btnClass: 'bg-yellow-600/80 hover:bg-yellow-500/80 border-yellow-500/30' };
        case 'id-exists': return { icon: <X size={64} className="mx-auto text-red-500/80 mb-6" />, title: '아이디 확인', desc: '이미 사용 중인 아이디입니다.', btnText: '확인', btnClass: 'bg-red-600/80 hover:bg-red-500/80 border-red-500/30' };
        case 'id-available': return { icon: <CheckCircle2 size={64} className="mx-auto text-teal-400/80 mb-6" />, title: '아이디 사용 가능', desc: '사용할 수 있는 아이디입니다.', btnText: '확인', btnClass: 'bg-teal-600/80 hover:bg-teal-500/80 border-teal-500/30' };
        case 'id-not-checked': return { icon: <AlertTriangle size={64} className="mx-auto text-yellow-500/80 mb-6" />, title: '아이디 중복 확인', desc: '아이디 중복을 확인해 주세요.', btnText: '확인', btnClass: 'bg-yellow-600/80 hover:bg-yellow-500/80 border-yellow-500/30' };
        case 'confirm': return { icon: <QuestionIcon size={64} className="mx-auto text-blue-400/80 mb-6" />, title: '서비스 이용 신청', desc: '입력하신 정보로 서비스 이용 신청을 하시겠습니까?', isConfirm: true };
        case 'success': return { icon: <CheckCircle2 size={64} className="mx-auto text-teal-400/80 mb-6" />, title: '신청 완료', desc: '서비스 이용 신청이 완료되었습니다. 승인 후 이용해 주세요.', btnText: '확인', btnClass: 'bg-teal-600/80 hover:bg-teal-500/80 border-teal-500/30' };
        default: return null;
      }
    };

    const content = getContent();
    if (!content) return null;

    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className={commonStyles}>
          <div className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{content.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
          <p className="text-slate-300 mb-8 leading-relaxed whitespace-pre-line">{content.desc}</p>
          {content.isConfirm ? (
            <div className="flex space-x-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-white/20 py-4 text-slate-300 hover:bg-white/5 transition-colors">취소</button>
              <button onClick={() => setModal({ type: 'success', isOpen: true })} className="flex-1 bg-blue-600/80 hover:bg-blue-500/80 text-white py-4 font-