import React from 'react';
import styled from 'styled-components';
import { Calendar, Phone, Mail, MapPin } from 'lucide-react';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 2rem 0 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #ecf0f1;
  }
  
  p {
    color: #bdc3c7;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #bdc3c7;
  
  svg {
    color: #3498db;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #34495e;
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: #95a5a6;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>عن العيادة</h3>
          <p>
            عيادة الدكتور تقدم خدمات طبية متميزة مع نظام حجز مواعيد متطور 
            لضمان راحة المرضى وتنظيم المواعيد بكفاءة عالية.
          </p>
        </FooterSection>
        
        <FooterSection>
          <h3>معلومات التواصل</h3>
          <ContactInfo>
            <Phone size={16} />
            <span>01234567890</span>
          </ContactInfo>
          <ContactInfo>
            <Mail size={16} />
            <span>doctor@example.com</span>
          </ContactInfo>
          <ContactInfo>
            <MapPin size={16} />
            <span>شارع الملك فهد، الرياض</span>
          </ContactInfo>
        </FooterSection>
        
        <FooterSection>
          <h3>ساعات العمل</h3>
          <p>السبت - الخميس: 9:00 ص - 6:00 م</p>
          <p>الجمعة: مغلق</p>
          <p>الطوارئ: متاح 24/7</p>
        </FooterSection>
        
        <FooterSection>
          <h3>خدماتنا</h3>
          <p>• حجز مواعيد أونلاين</p>
          <p>• استشارات طبية</p>
          <p>• متابعة الحالات</p>
          <p>• تقارير طبية</p>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; 2024 عيادة الدكتور. جميع الحقوق محفوظة.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
