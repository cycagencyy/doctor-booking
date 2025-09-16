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
  Mail,
  Filter,
  Search,
  DollarSign,
  Star,
  TrendingUp
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
  background-color: ${props => props.$variant === 'danger' ? '#e74c3c' : '#3498db'};
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
    background-color: ${props => props.$variant === 'danger' ? '#c0392b' : '#2980b9'};
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch(props.type) {
      case 'total': return '#3498db';
      case 'today': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'confirmed': return '#2ecc71';
      case 'revenue': return '#9b59b6';
      case 'rating': return '#e67e22';
      case 'growth': return '#1abc9c';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const StatContent = styled.div`
  h3 {
    font-size: 2rem;
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

const ControlsSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
  }
  
  select, input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e6ed;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
`;

const AppointmentsTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid #f1f2f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.h2`
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

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    confirmed: 0,
    revenue: 0,
    rating: 4.8,
    growth: 12
  });
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من تسجيل الدخول
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // جلب الإحصائيات
      const statsResponse = await axios.get('/api/admin/stats');
      setStats(statsResponse.data.data);
      
      // جلب الحجوزات مع الفلترة
      const appointmentsResponse = await axios.get('/api/admin/appointments', {
        params: filters
      });
      
      let filteredAppointments = appointmentsResponse.data.data;
      
      // فلترة محلية للبحث
      if (filters.search) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
          appointment.patientEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
          appointment.patientPhone.includes(filters.search)
        );
      }
      
      setAppointments(filteredAppointments);
      
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      toast.error('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const fetchDataWithFilters = async (filterParams) => {
    try {
      // جلب الحجوزات مع الفلترة
      const appointmentsResponse = await axios.get('/api/admin/appointments', {
        params: filterParams
      });
      
      let filteredAppointments = appointmentsResponse.data.data;
      
      // فلترة محلية للبحث
      if (filterParams.search) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.patientName.toLowerCase().includes(filterParams.search.toLowerCase()) ||
          appointment.patientEmail.toLowerCase().includes(filterParams.search.toLowerCase()) ||
          appointment.patientPhone.includes(filterParams.search)
        );
      }
      
      setAppointments(filteredAppointments);
      
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      toast.error('حدث خطأ في جلب البيانات');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
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

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    
    // تطبيق الفلتر تلقائياً عند تغيير الحالة أو التاريخ
    if (key === 'status' || key === 'date') {
      setFilterLoading(true);
      setTimeout(() => {
        fetchDataWithFilters(newFilters);
        setFilterLoading(false);
      }, 100);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    
    // البحث الفوري
    if (value.length === 0 || value.length >= 2) {
      fetchData();
    }
  };

  const handleSendReport = async () => {
    try {
      const response = await axios.post('/api/admin/send-daily-report');
      toast.success(`تم إرسال التقرير اليومي بنجاح (${response.data.data.appointmentsCount} حجز)`);
    } catch (error) {
      console.error('خطأ في إرسال التقرير:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('حدث خطأ في إرسال التقرير');
      }
    }
  };

  const handleExportReport = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`/api/admin/report?startDate=${today}&endDate=${today}&format=csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `تقرير-الحجوزات-${today}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('تم تصدير التقرير بنجاح');
    } catch (error) {
      console.error('خطأ في تصدير التقرير:', error);
      toast.error('حدث خطأ في تصدير التقرير');
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: '',
      date: '',
      search: ''
    };
    setFilters(clearedFilters);
    setTimeout(() => {
      fetchDataWithFilters(clearedFilters);
    }, 100);
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
        <DashboardTitle>لوحة تحكم الإدارة</DashboardTitle>
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

      <StatsGrid>
        <StatCard>
          <StatIcon type="total">
            <Calendar size={24} />
          </StatIcon>
          <StatContent>
            <h3>{stats.total}</h3>
            <p>إجمالي الحجوزات</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="today">
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <h3>{stats.today}</h3>
            <p>حجوزات اليوم</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="pending">
            <AlertCircle size={24} />
          </StatIcon>
          <StatContent>
            <h3>{stats.pending}</h3>
            <p>في الانتظار</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="confirmed">
            <CheckCircle size={24} />
          </StatIcon>
          <StatContent>
            <h3>{stats.confirmed}</h3>
            <p>مؤكدة</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="revenue">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <h3>{stats.revenue} ريال</h3>
            <p>الإيرادات</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="rating">
            <Star size={24} />
          </StatIcon>
          <StatContent>
            <h3>{stats.rating}</h3>
            <p>التقييم</p>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="growth">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <h3>+{stats.growth}%</h3>
            <p>النمو</p>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ControlsSection>
        <ControlsGrid>
          <FormGroup>
            <label>البحث</label>
            <input 
              type="text" 
              placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
              value={filters.search} 
              onChange={handleSearchChange}
            />
          </FormGroup>
          
          <FormGroup>
            <label>فلترة حسب الحالة</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="cancelled">ملغي</option>
              <option value="completed">مكتمل</option>
            </select>
          </FormGroup>
          
          <FormGroup>
            <label>فلترة حسب التاريخ</label>
            <input 
              type="date" 
              value={filters.date} 
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </FormGroup>
          
          <Button onClick={fetchData}>
            <Filter size={16} />
            تطبيق الفلتر
          </Button>
          
          <Button $variant="danger" onClick={clearFilters}>
            <XCircle size={16} />
            مسح الفلاتر
          </Button>
        </ControlsGrid>
      </ControlsSection>

      <AppointmentsTable>
        <TableHeader>
          <TableTitle>الحجوزات</TableTitle>
          <HeaderActions>
            <Button onClick={handleExportReport}>
              <Calendar size={16} />
              تصدير تقرير
            </Button>
            <Button onClick={handleSendReport}>
              <Mail size={16} />
              إرسال تقرير
            </Button>
          </HeaderActions>
        </TableHeader>
        
        {filterLoading ? (
          <LoadingSpinner>
            <RefreshCw size={24} className="spinner" />
            جاري تطبيق الفلتر...
          </LoadingSpinner>
        ) : appointments.length === 0 ? (
          <EmptyState>
            <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>لا توجد حجوزات</p>
          </EmptyState>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>اسم المريض</TableHeaderCell>
                <TableHeaderCell>البريد الإلكتروني</TableHeaderCell>
                <TableHeaderCell>رقم الهاتف</TableHeaderCell>
                <TableHeaderCell>التاريخ</TableHeaderCell>
                <TableHeaderCell>الوقت</TableHeaderCell>
                <TableHeaderCell>الحالة</TableHeaderCell>
                <TableHeaderCell>الإجراءات</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.patientEmail}</TableCell>
                  <TableCell>{appointment.patientPhone}</TableCell>
                  <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
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
      </AppointmentsTable>
    </DashboardContainer>
  );
};

export default AdminDashboard;
