import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  LogOut,
  RefreshCw,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Edit
} from 'lucide-react';
import axios from 'axios';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DashboardTitle = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  background-color: ${props => props.$variant === 'danger' ? '#e74c3c' : '#27ae60'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.$variant === 'danger' ? '#c0392b' : '#229954'};
    transform: translateY(-2px);
  }
`;

const DoctorInfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const DoctorAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const DoctorDetails = styled.div`
  h2 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    color: #7f8c8d;
    margin: 0.25rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const EditButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch(props.type) {
      case 'today': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'confirmed': return '#2ecc71';
      case 'total': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const StatContent = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
  }
  
  p {
    color: #7f8c8d;
    margin: 0;
    font-size: 0.9rem;
  }
`;

const AppointmentsSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid #f1f2f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: right;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e6ed;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e0e6ed;
  color: #2c3e50;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => {
    switch(props.$status) {
      case 'confirmed': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'cancelled': return '#f8d7da';
      case 'completed': return '#d1ecf1';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'confirmed': return '#155724';
      case 'pending': return '#856404';
      case 'cancelled': return '#721c24';
      case 'completed': return '#0c5460';
      default: return '#383d41';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.confirm {
    background-color: #27ae60;
    color: white;
    
    &:hover {
      background-color: #229954;
    }
  }
  
  &.cancel {
    background-color: #e74c3c;
    color: white;
    
    &:hover {
      background-color: #c0392b;
    }
  }
  
  &.complete {
    background-color: #3498db;
    color: white;
    
    &:hover {
      background-color: #2980b9;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
`;

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    confirmed: 0
  });
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من تسجيل الدخول
    const token = localStorage.getItem('doctorToken');
    const doctorData = localStorage.getItem('doctorData');
    
    if (!token || !doctorData) {
      navigate('/doctor/login');
      return;
    }
    
    setDoctor(JSON.parse(doctorData));
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // جلب الإحصائيات
      const statsResponse = await axios.get('/api/admin/stats');
      setStats(statsResponse.data.data);
      
      // جلب حجوزات اليوم
      const appointmentsResponse = await axios.get('/api/admin/today');
      setAppointments(appointmentsResponse.data.data);
      
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      toast.error('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorData');
    navigate('/doctor/login');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`/api/admin/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      
      toast.success('تم تحديث حالة الحجز بنجاح');
      fetchData(); // إعادة جلب البيانات
      
    } catch (error) {
      console.error('خطأ في تحديث الحجز:', error);
      toast.error('حدث خطأ في تحديث الحجز');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      cancelled: 'ملغي',
      completed: 'مكتمل'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      calendar: 'gregory'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>
          <RefreshCw size={24} className="spinner" />
          جاري تحميل البيانات...
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>لوحة تحكم الدكتور</DashboardTitle>
        <HeaderActions>
          <Button onClick={fetchData}>
            <RefreshCw size={16} />
            تحديث
          </Button>
          <Button $variant="danger" onClick={handleLogout}>
            <LogOut size={16} />
            تسجيل الخروج
          </Button>
        </HeaderActions>
      </DashboardHeader>

      {doctor && (
        <DoctorInfoCard>
          <DoctorAvatar>
            {getInitials(doctor.name)}
          </DoctorAvatar>
          <DoctorDetails>
            <h2>د. {doctor.name}</h2>
            <p><Mail size={16} /> {doctor.email}</p>
            <p><Phone size={16} /> {doctor.phone}</p>
            <p><UserIcon size={16} /> {doctor.specialization}</p>
          </DoctorDetails>
          <EditButton>
            <Edit size={16} />
            تعديل الملف الشخصي
          </EditButton>
        </DoctorInfoCard>
      )}

      <StatsGrid>
        <StatCard>
          <StatIcon type="today">
            <Clock size={20} />
          </StatIcon>
          <StatContent>
            <h3>{stats.today}</h3>
            <p>حجوزات اليوم</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="pending">
            <AlertCircle size={20} />
          </StatIcon>
          <StatContent>
            <h3>{stats.pending}</h3>
            <p>في الانتظار</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="confirmed">
            <CheckCircle size={20} />
          </StatIcon>
          <StatContent>
            <h3>{stats.confirmed}</h3>
            <p>مؤكدة</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="total">
            <Calendar size={20} />
          </StatIcon>
          <StatContent>
            <h3>{stats.total}</h3>
            <p>إجمالي الحجوزات</p>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <AppointmentsSection>
        <SectionHeader>
          <SectionTitle>حجوزات اليوم</SectionTitle>
          <Button onClick={fetchData}>
            <RefreshCw size={16} />
            تحديث
          </Button>
        </SectionHeader>
        
        {appointments.length === 0 ? (
          <EmptyState>
            <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>لا توجد حجوزات لليوم</p>
          </EmptyState>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>اسم المريض</TableHeaderCell>
                <TableHeaderCell>رقم الهاتف</TableHeaderCell>
                <TableHeaderCell>الوقت</TableHeaderCell>
                <TableHeaderCell>الحالة</TableHeaderCell>
                <TableHeaderCell>الإجراءات</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.patientPhone}</TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>
                    <StatusBadge $status={appointment.status}>
                      {getStatusText(appointment.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      {appointment.status === 'pending' && (
                        <>
                          <ActionButton 
                            className="confirm"
                            onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                            title="تأكيد"
                          >
                            <CheckCircle size={16} />
                          </ActionButton>
                          <ActionButton 
                            className="cancel"
                            onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                            title="إلغاء"
                          >
                            <XCircle size={16} />
                          </ActionButton>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <ActionButton 
                          className="complete"
                          onClick={() => handleStatusChange(appointment._id, 'completed')}
                          title="إكمال"
                        >
                          <CheckCircle size={16} />
                        </ActionButton>
                      )}
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AppointmentsSection>
    </DashboardContainer>
  );
};

export default DoctorDashboard;
