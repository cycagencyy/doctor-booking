import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, User, Settings, Moon, Sun } from 'lucide-react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #f8f9fa;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <Calendar size={24} />
          عيادة الدكتور
        </Logo>
        
        <NavLinks $isOpen={isMenuOpen}>
          <NavLink to="/" className={isActive('/')}>
            الرئيسية
          </NavLink>
          <NavLink to="/booking" className={isActive('/booking')}>
            <Calendar size={16} />
            حجز موعد
          </NavLink>
          <NavLink to="/doctor/login" className={isActive('/doctor/login')}>
            <User size={16} />
            تسجيل دخول الدكتور
          </NavLink>
          <NavLink to="/admin/login" className={isActive('/admin/login')}>
            <Settings size={16} />
            لوحة الإدارة
          </NavLink>
          <ThemeToggle onClick={toggleTheme} title={isDarkMode ? 'الوضع الفاتح' : 'الوضع المظلم'}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeToggle>
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
