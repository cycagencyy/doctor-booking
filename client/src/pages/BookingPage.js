import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { Clock, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BookingContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: ${props => props.$active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.$active ? 'white' : '#7f8c8d'};
  font-weight: 600;
  margin: 0 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TimeSlot = styled.button`
  padding: 0.75rem;
  border: 2px solid ${props => props.$selected ? '#3498db' : '#e0e6ed'};
  border-radius: 8px;
  background-color: ${props => props.$selected ? '#3498db' : 'white'};
  color: ${props => props.$selected ? 'white' : '#2c3e50'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3498db;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    color: #adb5bd;
    cursor: not-allowed;
    transform: none;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
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

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &.error {
    border-color: #e74c3c;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  color: #155724;
`;

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  // جلب المواعيد المتاحة عند تغيير التاريخ
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`/api/appointments/available/${dateStr}`);
      setAvailableSlots(response.data.data.availableSlots);
    } catch (error) {
      console.error('خطأ في جلب المواعيد المتاحة:', error);
      toast.error('حدث خطأ في جلب المواعيد المتاحة');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

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
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'اسم المريض مطلوب';
    }
    
    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.patientPhone)) {
      newErrors.patientPhone = 'رقم الهاتف غير صحيح';
    }
    
    if (!selectedDate) {
      newErrors.date = 'تاريخ الموعد مطلوب';
    }
    
    if (!selectedTime) {
      newErrors.time = 'وقت الموعد مطلوب';
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
      const appointmentData = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: selectedTime,
        notes: formData.notes
      };
      
      const response = await axios.post('/api/appointments', appointmentData);
      
      setBookingData(response.data.data);
      setBookingSuccess(true);
      toast.success('تم حجز الموعد بنجاح!');
      
    } catch (error) {
      console.error('خطأ في حجز الموعد:', error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ في حجز الموعد';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (bookingSuccess) {
    return (
      <BookingContainer>
        <BookingCard>
          <SuccessMessage>
            <CheckCircle size={48} style={{ marginBottom: '1rem', color: '#27ae60' }} />
            <h2>تم حجز الموعد بنجاح!</h2>
            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
              شكراً لك {bookingData.patientName}، تم حجز موعدك بنجاح
            </p>
            <div style={{ marginTop: '1.5rem', textAlign: 'right', maxWidth: '400px', margin: '1.5rem auto 0' }}>
              <p><strong>تاريخ الموعد:</strong> {new Date(bookingData.appointmentDate).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                calendar: 'gregory'
              })}</p>
              <p><strong>وقت الموعد:</strong> {bookingData.appointmentTime}</p>
              <p><strong>حالة الموعد:</strong> في انتظار التأكيد</p>
            </div>
            <p style={{ marginTop: '1.5rem', color: '#7f8c8d' }}>
              سيتم إرسال تأكيد الموعد إلى بريدك الإلكتروني قريباً
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: '1.5rem', maxWidth: '200px' }}
            >
              حجز موعد جديد
            </Button>
          </SuccessMessage>
        </BookingCard>
      </BookingContainer>
    );
  }

  return (
    <BookingContainer>
      <BookingCard>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
          حجز موعد جديد
        </h1>
        
        <StepIndicator>
          <Step $active={currentStep >= 1}>1. اختيار التاريخ والوقت</Step>
          <Step $active={currentStep >= 2}>2. بيانات المريض</Step>
          <Step $active={currentStep >= 3}>3. تأكيد الحجز</Step>
        </StepIndicator>

        {currentStep === 1 && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              اختر التاريخ والوقت المناسب لك
            </h2>
            
            <CalendarContainer>
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>اختر التاريخ</h3>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileDisabled={isDateDisabled}
                  locale="ar"
                  formatShortWeekday={(locale, date) => {
                    const weekdays = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
                    return weekdays[date.getDay()];
                  }}
                />
              </div>
              
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>اختر الوقت</h3>
                {availableSlots.length > 0 ? (
                  <TimeSlotsGrid>
                    {availableSlots.map((slot) => (
                      <TimeSlot
                        key={slot}
                        $selected={selectedTime === slot}
                        onClick={() => handleTimeSelect(slot)}
                      >
                        {slot}
                      </TimeSlot>
                    ))}
                  </TimeSlotsGrid>
                ) : (
                  <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                    لا توجد مواعيد متاحة في هذا التاريخ
                  </p>
                )}
              </div>
            </CalendarContainer>
            
            {selectedDate && selectedTime && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Button onClick={() => setCurrentStep(2)}>
                  المتابعة إلى بيانات المريض
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(3); }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              بيانات المريض
            </h2>
            
            <FormGrid>
              <FormGroup>
                <Label>
                  <User size={16} />
                  اسم المريض *
                </Label>
                <Input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className={errors.patientName ? 'error' : ''}
                  placeholder="أدخل اسم المريض"
                />
                {errors.patientName && (
                  <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {errors.patientName}
                  </p>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Mail size={16} />
                  البريد الإلكتروني *
                </Label>
                <Input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleInputChange}
                  className={errors.patientEmail ? 'error' : ''}
                  placeholder="example@email.com"
                />
                {errors.patientEmail && (
                  <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {errors.patientEmail}
                  </p>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Phone size={16} />
                  رقم الهاتف *
                </Label>
                <Input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  className={errors.patientPhone ? 'error' : ''}
                  placeholder="01234567890"
                />
                {errors.patientPhone && (
                  <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {errors.patientPhone}
                  </p>
                )}
              </FormGroup>
            </FormGrid>
            
            <FormGroup className="full-width">
              <Label>
                <FileText size={16} />
                ملاحظات (اختياري)
              </Label>
              <TextArea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="أي ملاحظات أو معلومات إضافية..."
              />
            </FormGroup>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(1)}
                style={{ backgroundColor: '#95a5a6' }}
              >
                العودة
              </Button>
              <Button type="submit">
                مراجعة الحجز
              </Button>
            </div>
          </form>
        )}

        {currentStep === 3 && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
              تأكيد الحجز
            </h2>
            
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>تفاصيل الموعد</h3>
              <p><strong>التاريخ:</strong> {selectedDate.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                calendar: 'gregory'
              })}</p>
              <p><strong>الوقت:</strong> {selectedTime}</p>
              <p><strong>اسم المريض:</strong> {formData.patientName}</p>
              <p><strong>البريد الإلكتروني:</strong> {formData.patientEmail}</p>
              <p><strong>رقم الهاتف:</strong> {formData.patientPhone}</p>
              {formData.notes && <p><strong>ملاحظات:</strong> {formData.notes}</p>}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button 
                onClick={() => setCurrentStep(2)}
                style={{ backgroundColor: '#95a5a6' }}
              >
                تعديل البيانات
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
              </Button>
            </div>
          </div>
        )}
      </BookingCard>
    </BookingContainer>
  );
};

export default BookingPage;
