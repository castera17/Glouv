import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import supabase from '../supabase';

import Header from '../components/header';
import { useAuth } from '../context/AuthContext';

export default function CalendarioScreen() {
  const navigation = useNavigation();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [tiempoEntrenado, setTiempoEntrenado] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const sumarTiempos = (tiempos) => {
    let totalSegundos = 0;

    tiempos.forEach((tiempo) => {
      const [h, m, s] = tiempo.split(':').map(Number);
      totalSegundos += h * 3600 + m * 60 + s;
    });

    const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, '0');
    const segundos = String(totalSegundos % 60).padStart(2, '0');

    return `${horas}:${minutos}:${segundos}`;
  };

  useEffect(() => {
    const cargarTiempoEntrenado = async () => {
      setLoading(true);
      console.log('Fecha seleccionada cambió:', fechaSeleccionada);

      try {
        const fechaISO = fechaSeleccionada.toISOString().slice(0, 10);

        const { data, error } = await supabase
          .from('UsuarioEntrenamiento')
          .select('tiempo')
          .eq('fecha', fechaISO)
          .eq('id_usuario', user.id);

        if (error) {
          console.error('Error cargando tiempo entrenado:', error);
          setTiempoEntrenado('Error');
        } else if (data.length > 0) {
          const tiempos = data.map((item) => item.tiempo);
          const totalTiempo = sumarTiempos(tiempos);
          setTiempoEntrenado(totalTiempo);
        } else {
          setTiempoEntrenado('00:00:00');
        }
      } catch (err) {
        console.error('Error inesperado:', err);
        setTiempoEntrenado('Error');
      }

      setLoading(false);
    };

    cargarTiempoEntrenado();
  }, [fechaSeleccionada, user]);

  return (
    <View style={{ backgroundColor: '#272727', flex: 1 }}>
      <Header titulo="Calendario" />

      <View style={styles.calendarioScreen}>
        <View style={{ height: 23 }} />

        <Calendar
          theme={{
            calendarBackground: '#272727',
            dayTextColor: 'white',
            monthTextColor: 'white',
            arrowColor: 'white',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
          }}
          onDayPress={(day) => {
            const nuevaFecha = new Date(day.dateString);
            setFechaSeleccionada(nuevaFecha);
          }}
          markedDates={{
            [fechaSeleccionada.toISOString().slice(0, 10)]: {
              selected: true,
              marked: true,
              selectedColor: '#00adf5',
            },
          }}
        />

        <View style={{ height: 46 }} />
        <Text style={styles.text}>
          Fecha: {fechaSeleccionada.toDateString()}
        </Text>
        <Text style={styles.text}>
          Tiempo entrenado: {loading ? 'Cargando...' : tiempoEntrenado}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarioScreen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    paddingHorizontal: 15,
  },
  text: {
    color: 'white',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'left',
    paddingHorizontal: 15,
    fontWeight: 'bold',
  },
});