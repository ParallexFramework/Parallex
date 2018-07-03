# Parallex

[Discord](https://discord.gg/gqgnAcJ)

Parallex is a fairly new JavaScript framework. Currently it only has a small bit of functionality. Feel free to create issues/pull requests if you want to contribute.

# Usage

## Getting Started

Download the **parallex.js** file and import it with a script tag into your HTML, before your other scripts using Parallex:

    <script src="parallex.js"></script>
    
Next, initialise the Parallex object, using the following syntax:

    new Parallex ( <Object> options );
    
Inside the `options`, set your container element (defaults to `document.body`) and your data variables (explained further on).

Here's a simple example of the initialisation:

    new Parallex ({
      elm: '#container'
    })

##Reactive Template Engine

Parallex has a simple template engine that works similar to most other JavaScript templating engines. You simply add a data object to your Parallex initialisation function and then specify the data variables inside your HTML to print out the corresponding values in their place. For example:

    <div id="container">
      [[name]]
    </div>
    
    <script>
      var parallex = new Parallex({
        elm: '#container',
        data: {
          name: 'Steve'
        }
      })
    </script>
    
The content of the `div` will then be `Steve`. The data object is also reactive, which means that when you update a value in the object, the HTML content will also update, for example:

    Parallex.data.name = 'John'
    
The content of the `div` will now be `John`.
