import React from 'react';

const View = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
const Text = ({ children }: { children?: React.ReactNode }) => <p>{children}</p>;

const LoginScreen: React.FC = () => {
    return (
        <View>
            <Text>Mobile Login Screen Placeholder</Text>
        </View>
    );
};

export default LoginScreen;
