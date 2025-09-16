import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { User, Lock, Eye, EyeOff, Stethoscope } from 'lucide-react';
import axios from 'axios';

const LoginContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const DoctorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const LoginTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
`;

const LoginSubtitle = styled.p`
  color: #7f8c8d;
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 3rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #27ae60;
    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
  }
  
  &.error {
    border-color: #e74c3c;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #2c3e50;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #229954;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const InfoBox = styled.div`
  background-color: #e8f5e8;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #155724;
  font-size: 0.9rem;
`;

const CreateDoctorButton = styled.button`
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }
`;

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // إزالة الخطأ عند بدء الكتابة
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/doctor/login', formData);
      
      localStorage.setItem('doctorToken', response.data.data.token);
      localStorage.setItem('doctorData', JSON.stringify(response.data.data.doctor));
      
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/doctor/dashboard');
      
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ في تسجيل الدخول';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefaultDoctor = async () => {
    try {
      setLoading(true);
      await axios.post('/api/doctor/create-default');
      toast.success('تم إنشاء الدكتور الافتراضي بنجاح');
      
      // تعبئة النموذج بالبيانات الافتراضية
      setFormData({
        email: 'doctor@example.com',
        password: '123456'
      });
      
    } catch (error) {
      console.error('خطأ في إنشاء الدكتور الافتراضي:', error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ في إنشاء الدكتور الافتراضي';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <DoctorIcon>
            <Stethoscope size={32} />
          </DoctorIcon>
          <LoginTitle>تسجيل دخول الدكتور</LoginTitle>
          <LoginSubtitle>ادخل بياناتك للوصول إلى لوحة التحكم</LoginSubtitle>
        </LoginHeader>
        
        <InfoBox>
          <strong>ملاحظة:</strong> إذا لم يكن لديك حساب، يمكنك إنشاء دكتور افتراضي للاختبار
        </InfoBox>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <User size={16} />
              البريد الإلكتروني
            </Label>
            <InputContainer>
              <InputIcon>
                <User size={16} />
              </InputIcon>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="أدخل البريد الإلكتروني"
              />
            </InputContainer>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Lock size={16} />
              كلمة المرور
            </Label>
            <InputContainer>
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="أدخل كلمة المرور"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputContainer>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
        
        <CreateDoctorButton 
          onClick={handleCreateDefaultDoctor} 
          disabled={loading}
        >
          إنشاء دكتور افتراضي للاختبار
        </CreateDoctorButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default DoctorLogin;
