import { View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation } from '@react-navigation/native'

import { useEffect, useState } from 'react';

import Header from '../components/header';
import ImagenBoton from '../components/imagenBoton';
import Separador from '../components/separador';

import supabase from '../supabase';

export default function EntrenamientosTotalesScreen(){

    const navigation = useNavigation();

    const [entrenamientos, setEntrenamientos] = useState([]);

    useEffect(() => {
      const cargarEntrenamientos = async () => {
        const { data, error } = await supabase
          .from('Entrenamientos')
          .select('id, nombre, foto, descripcion, duracion');
  
        if (error) {
          console.error('Error cargando entrenamientos:', error);
        } else {
          setEntrenamientos(data);
        }
      };
  
      cargarEntrenamientos();
    }, []);



    return (

      
<View style={{flex: 1, backgroundColor: '#272727',}}>
       
 <Header titulo="Todos los entrenamientos" showBack={true}/>         

  <ScrollView>
<View style={styles.entrenamientosScreen}>
      
        <View style={{ height: 25 }} />
        
          {entrenamientos.map((entreno) => (
            
            <View key={entreno.id} style={{ width: '100%', alignItems: 'center' }}> 
              <ImagenBoton
                imagenDeBoton={entreno.foto}
                texto={entreno.nombre}
                desc={entreno.descripcion}
                onPress={() =>
                  navigation.navigate('detalleEntrenamiento', {
                    imagen: entreno.foto,
                    titulo: entreno.nombre,
                    Descripcion: entreno.descripcion,
                    tiempoT: entreno.duracion

                  })
                }
              />
        <Separador colorS="white" mB= {43} mT= {22.5}/>  
            </View>
            
          ))}
          
          

</View>
</ScrollView>

      </View>
    );
  }
  
  
const styles = StyleSheet.create({

  entrenamientosScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: 25,
    marginTop: 10.5,
    marginBottom: 23,
    marginRight:175,
    fontWeight: 'bold',
    
  },
  }
);  