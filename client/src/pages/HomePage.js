import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Clock, User, Shield, Mail, Phone, MapPin, Star } from 'lucide-react';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  border-radius: 0 0 20px 20px;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
`;

const InfoSection = styled.section`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #27ae60, #229954);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  h4 {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #7f8c8d;
    margin: 0;
  }
`;

const TestimonialsSection = styled.section`
  margin-bottom: 4rem;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const TestimonialText = styled.p`
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorInfo = styled.div`
  h5 {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: #7f8c8d;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>عيادة الدكتور</HeroTitle>
        <HeroSubtitle>
          احجز موعدك بسهولة وأمان مع نظام الحجوزات المتطور
        </HeroSubtitle>
        <CTAButton to="/booking">
          <Calendar size={20} style={{ marginLeft: '0.5rem' }} />
          احجز موعدك الآن
        </CTAButton>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>لماذا تختار عيادتنا؟</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <Calendar size={32} />
            </FeatureIcon>
            <FeatureTitle>حجز سهل وسريع</FeatureTitle>
            <FeatureDescription>
              احجز موعدك في أي وقت ومن أي مكان باستخدام نظام الحجوزات المتطور
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <Clock size={32} />
            </FeatureIcon>
            <FeatureTitle>مواعيد منظمة</FeatureTitle>
            <FeatureDescription>
              لا مزيد من الانتظار الطويل، مواعيدك محجوزة ومضمونة
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <Shield size={32} />
            </FeatureIcon>
            <FeatureTitle>خدمة آمنة وموثوقة</FeatureTitle>
            <FeatureDescription>
              بياناتك محمية ومعلوماتك آمنة معنا
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <InfoSection>
        <SectionTitle>معلومات التواصل</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoIcon>
              <Phone size={20} />
            </InfoIcon>
            <InfoContent>
              <h4>رقم الهاتف</h4>
              <p>01234567890</p>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <InfoIcon>
              <Mail size={20} />
            </InfoIcon>
            <InfoContent>
              <h4>البريد الإلكتروني</h4>
              <p>doctor@example.com</p>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <InfoIcon>
              <MapPin size={20} />
            </InfoIcon>
            <InfoContent>
              <h4>العنوان</h4>
              <p>شارع الملك فهد، الرياض</p>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <InfoIcon>
              <Clock size={20} />
            </InfoIcon>
            <InfoContent>
              <h4>ساعات العمل</h4>
              <p>السبت - الخميس: 9:00 ص - 6:00 م</p>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </InfoSection>

      <TestimonialsSection>
        <SectionTitle>آراء المرضى</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f39c12" color="#f39c12" />
              ))}
            </Stars>
            <TestimonialText>
              "خدمة ممتازة! حجزت موعدي بسهولة وتم تأكيده فوراً. الدكتور محترف جداً"
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorInfo>
                <h5>أحمد محمد</h5>
                <p>مريض</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f39c12" color="#f39c12" />
              ))}
            </Stars>
            <TestimonialText>
              "النظام سهل الاستخدام والمواعيد منظمة بشكل رائع. أنصح الجميع"
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorInfo>
                <h5>فاطمة أحمد</h5>
                <p>مريضة</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f39c12" color="#f39c12" />
              ))}
            </Stars>
            <TestimonialText>
              "لا مزيد من الانتظار في العيادة. النظام يوفر الوقت والجهد"
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorInfo>
                <h5>محمد علي</h5>
                <p>مريض</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>
    </HomeContainer>
  );
};

export default HomePage;
