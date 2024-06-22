/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {  
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to Duck Curiosities, you can say Hello or Help. Which would you like to try?',
            HELLO_MESSAGE: 'Hello! Thank you for using Duck Curiosities, how can I help you?',
            HELP_MESSAGE: 'You can say hello to me! How can I help?',
            GOODBYE_MESSAGE: 'Goodbye!',
            REFLECTOR_MESSAGE: 'You just triggered %s',
            FALLBACK_MESSAGE: 'Do you have any other questions?',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
            GET_FACTS_MSG: 'A curious fact about ducks is ...',
            FACTS: [
                'ducks are aquatic birds of the family Anatidae',
                'they have webbed feet that help them swim',
                'their feathers are waterproof thanks to an oil they produce',
                'they can fly long distances during migration',
                'male ducks are usually more colorful than females',
                'they have almost panoramic vision due to the position of their eyes',
                'they can sleep with one eye open to stay alert to predators',
                'some species of ducks can dive to great depths to find food'
            ]
        }
    },  
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido a Curiosidades sobre Patos, puedes decir Hola o Ayuda. ¿Cuál prefieres?',
            HELLO_MESSAGE: '¡Hola! Gracias por usar Curiosidades sobre Patos, ¿cómo te puedo ayudar?',
            HELP_MESSAGE: 'Puedes decirme hola. ¿Cómo te puedo ayudar?',
            GOODBYE_MESSAGE: '¡Adiós!',
            REFLECTOR_MESSAGE: 'Acabas de activar %s',
            FALLBACK_MESSAGE: '¿Deseas preguntar algo más?',
            ERROR_MESSAGE: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez.',
            GET_FACTS_MSG: 'Un dato curioso sobre los patos es ...',
            FACTS: [
                'los patos son aves acuáticas de la familia Anatidae',
                'tienen patas palmeadas que les ayudan a nadar',
                'sus plumas son impermeables gracias a un aceite que producen',
                'pueden volar largas distancias durante la migración',
                'los patos machos suelen ser más coloridos que las hembras',
                'tienen una visión casi panorámica gracias a la posición de sus ojos',
                'pueden dormir con un ojo abierto para mantenerse alerta ante los depredadores',
                'algunas especies de patos pueden bucear a grandes profundidades para encontrar alimento'
            ]
        }
    }
};

// Interceptor para registrar todas las solicitudes entrantes a esta lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// Interceptor para registrar todas las respuestas salientes de esta lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// Interceptor de localización para configurar i18n
const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const FrasesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FrasesIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const frasesArray = t('FACTS');
        const frasesIndice = Math.floor(Math.random() * frasesArray.length);
        const randomFrase = frasesArray[frasesIndice];
        const speakOutput = t('GET_FACTS_MSG') + randomFrase + '... ' + t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(t('HELP_MESSAGE'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FrasesIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor
    )
    .addResponseInterceptors(LoggingResponseInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
