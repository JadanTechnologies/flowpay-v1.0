import React from 'react';

const View: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div>{children}</div>;
const Text: React.FC<{ children?: React.ReactNode }> = ({ children }) => <p>{children}</p>;

const LoginScreen: React.FC = () => {
    return (
        <View>
            <Text>Mobile Login Screen Placeholder</Text>
        </View>
    );
};

export default LoginScreen;