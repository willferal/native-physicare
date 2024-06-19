import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'


const TabIcon = ({icon, color, name, focused})=> {
  return (
    <View className="items-center justify-center gap-1">
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-6 h-6'
      />

      <Text className= {`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{color: color}}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70
          }
        }
        }
      >
        <Tabs.Screen 
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name='Home'
                focused={focused}
              />
            )
          }
          }
        />

        <Tabs.Screen 
          name='messages'
          options={{
            title: 'Messages',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.messages}
                color={color}
                name='Messages'
                focused={focused}
              />
            )
          }
          }
        />

        <Tabs.Screen 
          name='perimetry'
          options={{
            title: 'Perimetry',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.perimetry}
                color={color}
                name='Perimetry'
                focused={focused}
              />
            )
          }
          }
        />

        <Tabs.Screen 
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name='Profile'
                focused={focused}
              />
            )
          }
          }
        />

        <Tabs.Screen 
          name='search'
          options={{
            title: 'Search',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.search}
                color={color}
                name='Search'
                focused={focused}
              />
            )
          }
          }
        />
      </Tabs>
    </>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})