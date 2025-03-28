import { Pressable, Text, View } from 'react-native';

export default function EditSources() {
    return (
        <View className='pl-12'>
            <Pressable 
                className='bg-gray-300 w-32 h-9 rounded-3xl justify-center border-black border'
                onPress={() => {}}
            >
                <Text className='text-gray-500 text-center'>Edit Sources</Text>
            </Pressable>
        </View>
    )
}