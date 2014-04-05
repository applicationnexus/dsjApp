//
//  DBCopy.m
//  Lyon
//
//  Created by Rahul on 12/19/13.
//
//

#import "DBCopy.h"
#import <Cordova/CDV.h>
#import <Social/SLComposeViewController.h>


@implementation DBCopy
@synthesize callbackId;

- (void)copyDBtoDocDir:(CDVInvokedUrlCommand *)command
{
    self.callbackId = command.callbackId;
    BOOL success;
    NSError *error = nil;
    CDVPluginResult *result = nil;
    //NSString *dbname = @"LondonTravel";
    NSString *dbname = [command argumentAtIndex:0];
    NSLog(@"Dbname = %@",dbname);
    
    paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    documentsDirectory = [paths objectAtIndex:0];
    
     NSString *dbPath = [documentsDirectory stringByAppendingPathComponent:dbname];
       
    
    fileManager = [NSFileManager defaultManager];
    
    success = [fileManager fileExistsAtPath:dbPath isDirectory:NO];
    
    if (!success) {
        NSLog(@"copying db file");
        
        NSString *dbPathFromApp = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:dbname];
        
        if (!([fileManager copyItemAtPath:dbPathFromApp toPath:dbPath error:&error])) {
            NSLog(@"Could not copy file from %@ to %@. Error = %@",dbPathFromApp,dbPath,error);
            result = [CDVPluginResult resultWithStatus: CDVCommandStatus_ERROR messageAsString:error.description];
            //[self.webView stringByEvaluatingJavaScriptFromString:[result toErrorCallbackString:callbackId]];
        } else {
            result =  [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"File Copied"];
            //[self.webView stringByEvaluatingJavaScriptFromString:[result toSuccessCallbackString:callbackId]];
        }
        
        
    }
    else
    {
        NSLog(@"File Aready Exists");
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"File Already Exists"];
        //[self.webView stringByEvaluatingJavaScriptFromString:[result toErrorCallbackString:callbackId]];
    }
    
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    
   // [fileManager release];

}

@end
