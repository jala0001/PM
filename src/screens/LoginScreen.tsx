import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LoginScreenProps {
  onContinue?: (phoneNumber: string) => void;
}

const LoginScreen = ({ onContinue }: LoginScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length >= 8) {
      console.log('📱 Login attempt med:', phoneNumber);
      onContinue?.(phoneNumber);
    }
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length <= 8) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4').trim();
    }
    
    return cleaned.substring(0, 8);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const isValidPhone = phoneNumber.replace(/\s/g, '').length === 8;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ImageBackground
        source={{
          uri: 'https://assets.codepen.io/187210/wp.webp'
        }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      />

      <BlurView
        style={styles.blurContainer}
        intensity={80}
        tint="dark"
      >
        <View style={styles.darkOverlay} />
        
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.keyboardView}
          >
            <View style={styles.content}>
              
              {/* Header Text */}
              <View style={styles.headerSection}>
                <Text style={styles.headerText}>Hello,</Text>
                <Text style={styles.subHeaderText}>
                  add your phone number{'\n'}to continue.
                </Text>
              </View>

              {/* Phone Input Section */}
              <View style={styles.inputSection}>
                <View style={styles.combinedInputContainer}>
                  
                  {/* Country Code Field - TOP */}
                  <TouchableOpacity 
                    style={styles.countryFieldContainer}
                    onPress={() => {
                      console.log('🌍 Open country picker');
                    }}
                    activeOpacity={0.7}
                  >
                    <BlurView
                      style={styles.countryBlurContainer}
                      intensity={30}
                      tint="light"
                    >
                      <View style={styles.inputOverlay} />
                      <View style={styles.countryContent}>
                        <Text style={styles.countryCodeText}>+45 Denmark</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                  
                  {/* Phone Number Field - BOTTOM */}
                  <BlurView
                    style={styles.phoneBlurContainer}
                    intensity={30}
                    tint="light"
                  >
                    <View style={styles.inputOverlay} />
                    <TextInput
                      style={styles.phoneInput}
                      value={phoneNumber}
                      onChangeText={handlePhoneChange}
                      placeholder="Phone number"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      keyboardType="numeric"
                      maxLength={11}
                      autoFocus={true}
                      textContentType="telephoneNumber"
                      inputAccessoryView={
                        <View style={styles.inputAccessoryContainer}>
                          <TouchableOpacity 
                            style={[
                              styles.keyboardContinueButton,
                              isValidPhone && styles.keyboardContinueButtonActive
                            ]}
                            onPress={handleContinue}
                            disabled={!isValidPhone}
                            activeOpacity={0.8}
                          >
                            <Text style={[
                              styles.keyboardContinueText,
                              isValidPhone && styles.keyboardContinueTextActive
                            ]}>
                              Continue
                            </Text>
                          </TouchableOpacity>
                        </View>
                      }
                    />
                  </BlurView>
                  
                </View>
                
                <Text style={styles.termsText}>
                  We'll send you a code to log in or sign up. See our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                </Text>
              </View>

              {/* Continue Button - nu flyttet til keyboard accessory */}
              {/* <TouchableOpacity 
                style={styles.continueButtonWrapper}
                onPress={handleContinue}
                disabled={!isValidPhone}
                activeOpacity={0.8}
              >
                <BlurView
                  style={[
                    styles.continueButtonBlur,
                    isValidPhone && styles.continueButtonBlurActive
                  ]}
                  intensity={isValidPhone ? 20 : 60}
                  tint="light"
                >
                  <View style={[
                    styles.buttonOverlay,
                    isValidPhone && styles.buttonOverlayActive
                  ]} />
                  <Text style={[
                    styles.continueButtonText,
                    isValidPhone && styles.continueButtonTextActive
                  ]}>
                    Continue
                  </Text>
                </BlurView>
              </TouchableOpacity> */}

              {/* Bottom Spacer */}
              <View style={styles.bottomSpacer} />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
    transform: [{ scale: 1.15 }],
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  headerSection: {
    marginTop: screenHeight * 0.12,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeaderText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 28,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  inputSection: {
    marginBottom: 30,
    paddingTop: 40,
  },
  combinedInputContainer: {
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countryFieldContainer: {
  },
  countryBlurContainer: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 60,
    justifyContent: 'center',
  },
  countryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  countryCodeText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dropdownArrow: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  phoneBlurContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    minHeight: 60,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  phoneInput: {
    fontSize: 17,
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  termsText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  termsLink: {
    color: '#7dd3fc',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  continueButtonWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 25,
    marginBottom: 20,
  },
  continueButtonBlur: {
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.4)',
  },
  continueButtonBlurActive: {
    borderColor: 'rgba(125, 211, 252, 0.8)',
  },
  buttonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
  },
  buttonOverlayActive: {
    backgroundColor: 'rgba(125, 211, 252, 0.8)',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  continueButtonTextActive: {
    color: 'rgba(0, 0, 0, 0.9)',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 34 : 20,
  },
  
  // INPUT ACCESSORY KEYBOARD STYLES
  inputAccessoryContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  keyboardContinueButton: {
    backgroundColor: 'rgba(125, 211, 252, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.4)',
  },
  
  keyboardContinueButtonActive: {
    backgroundColor: '#7dd3fc',
    borderColor: '#7dd3fc',
  },
  
  keyboardContinueText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  
  keyboardContinueTextActive: {
    color: 'rgba(0, 0, 0, 0.9)',
  },
});

export default LoginScreen;